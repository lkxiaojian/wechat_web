package com.kingweather.fylat_service.service.integrationManage.impl;

import com.alibaba.fastjson.JSONObject;
import com.alibaba.fastjson.TypeReference;
import com.kingweather.common.component.ssh.SSHCommandExecutor;
import com.kingweather.common.util.DateUtil;
import com.kingweather.common.util.Page;
import com.kingweather.fylat_service.constants.SystemConstants;
import com.kingweather.fylat_service.dao.IntegrationManageDao;
import com.kingweather.fylat_service.dao.JobSchedulerDao;
import com.kingweather.fylat_service.service.integrationManage.JobSchedulerService;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import javax.annotation.Resource;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 作业流管理
 *
 * @author tian
 * @date 2017/12/21
 */
@Service
public class JobSchedulerServiceImpl implements JobSchedulerService {
    @Resource
    SSHCommandExecutor sshCommandExecutor;
    @Resource
    JobSchedulerDao JobSchedulerDaoImpl;
    @Resource
    private IntegrationManageDao integrationManageDao;
    //@Resource
   // private SimpMessagingTemplate messagingTemplate;

    String topicPath = "";

    /**
     * 查询作业流
     *
     * @param pageParamForPage 网页传过来的参数
     * @return
     */
    @Override
    public Page<Map<String, Object>> queryJobPage(Map<String, Object> pageParamForPage) {
        if (null == pageParamForPage.get("pageSize") || null == pageParamForPage.get("pageNumber")) {
            return null;
        }
        Map<String, Object> condition = new HashMap<String, Object>();
        String filed = " job_id,job_name,job_user,job_state,job_type,job_data_starttime,job_data_endtime,job_process,job_createtime,job_outputpath";
        condition = (Map<String, Object>) pageParamForPage.get("param");
        return JobSchedulerDaoImpl.queryJobList(condition, filed, (Integer) pageParamForPage.get("pageNumber"), (Integer) pageParamForPage.get("pageSize"));
    }

    /**
     * 作业流运行
     *
     * @param data
     */
    @Override
    public void jobRun(Map<String, Object> data) {
        Map<String, Object> dataMap = new HashMap<>();  //解析批处理时间结果map
        List<String> intIdList = new ArrayList<>();    //作业流下的进程，按执行顺序排序
        Map<String, String> srcPath = new HashMap<>();  //源码路径
        String startTime = data.get("startTime").toString();
        String endTime = data.get("endTime").toString();
        String process = data.get("jobProcess").toString();
        String jobId = data.get("jobId").toString();
        String int_id = "";
        boolean runState = false;  // 作业流运行状态： true：正常 false：失败
        Map<String, Object> updateJobstate = new HashMap<>();
        //if (process.indexOf(",") != -1) {注销的原因，个别产品只需要一个进程
            String[] processList = process.split(",");
            for (int i = 0; i < processList.length; i++) {
                intIdList.add(processList[i].split("_")[0]);

                //根据processid查询源码路径
                String filed = "int_src_path";
                Map<String, Object> condition = new HashMap<>();
                condition.put("int_id", processList[i].split("_")[0]);
                Map<String, Object> integration = integrationManageDao.queryIntegrationForId(condition, filed);
                srcPath.put(processList[i].split("_")[1], integration.get("int_src_path").toString());

                if (!processList[i].split("_")[1].equals("SST")) {
                    int_id = processList[i].split("_")[0];
                }
            }
        //}
        dataMap = analyseTime(startTime, endTime, int_id, intIdList);
        dataMap.put("job_id", jobId);
        dataMap.put("src_path", srcPath);
        try {
            runState = execMain(dataMap);
            // 更新作业流运行状态
            updateJobstate.put("job_id", Integer.parseInt(jobId));
            if (runState) { // 运行完成
                updateJobstate.put("job_state", "1");
            } else { // 运行失败
                updateJobstate.put("job_state", "2");
            }
            JobSchedulerDaoImpl.updateJobTable(updateJobstate);
        } catch (ParseException e) {

            e.printStackTrace();
        }
    }

    /**
     * 解析批处理时间
     *
     * @param startTime
     * @param endTime
     * @param int_id    进程id
     * @return
     */
    @Override
    public Map<String, Object> analyseTime(String startTime, String endTime, String int_id, List<String> intIdList) {
        Map<String, Object> jobData = new HashMap<>();
        Map<String, Object> interationConfig = new HashMap<>();
        List<String> date = new ArrayList<>(); //存放符合条件的日期目录
        Map<String, String> rangeMap = new HashMap<>();  //存放首尾日期
        String L1b_dataPath = "";
        String GEO_dataPath = "";

        //从数据库获取当前进程config
        interationConfig = JobSchedulerDaoImpl.getConfig(int_id);
        String configParam = interationConfig.get("config_param").toString();
        Map<String, String> configParamMap = JSONObject.parseObject(configParam, new TypeReference<Map<String, String>>() {
        });
        interationConfig.put("config_param", configParamMap);
        //输入数据路径头部
        L1b_dataPath = configParamMap.get("fy3_mersi_L1b_data").split("%")[0];
        GEO_dataPath = configParamMap.get("fy3_mersi_GEO_data").split("%")[0];
        //批处理所有时间
        date = makeDateList(L1b_dataPath, GEO_dataPath, startTime, endTime);
        //批处理开始时间/结束时间填入
        //rangeMap = makeRangeMap(L1b_dataPath, GEO_dataPath, startTime, endTime);
        jobData.put("dateList", date);
        jobData.put("rangeMap", new HashMap<String, String>() {{
            put("startTime", startTime);
            put("endTime", endTime);
        }});
        jobData.put("configMap", interationConfig);
        jobData.put("intList", intIdList);
        return jobData;
    }

    /**
     * 批处理开始时间和结束时间
     *
     * @param L1b_dataPath
     * @param GEO_dataPath
     * @param startTime
     * @param endTime
     * @return
     */
    private Map<String, String> makeRangeMap(String L1b_dataPath, String GEO_dataPath, String startTime, String endTime) {
        Map<String, String> rangeMap = new HashMap<>();
        if (ifFileExists(L1b_dataPath, startTime.split(" ")[0]) &&
                ifFileExists(GEO_dataPath, startTime.split(" ")[0])) {
            rangeMap.put("startTime", startTime);
        }
        if (ifFileExists(L1b_dataPath, endTime.split(" ")[0]) &&
                ifFileExists(GEO_dataPath, endTime.split(" ")[0])) {
            rangeMap.put("endTime", endTime);
        }
        return rangeMap;
    }

    /**
     * 批处理时间map
     *
     * @param L1b_dataPath,GEO_dataPath
     * @param dataStartTime
     * @param dataEndTime
     */
    private List<String> makeDateList(String L1b_dataPath, String GEO_dataPath, String dataStartTime, String dataEndTime) {
        List<String> date = new ArrayList<>();
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM/dd");
        Calendar calendar = Calendar.getInstance();
        try {
            Date start = dateFormat.parse(dataStartTime);
            Date end = dateFormat.parse(dataEndTime);
            Calendar d = Calendar.getInstance();
            d.setTime(end);
            d.add(Calendar.DAY_OF_MONTH, 1);
            end = d.getTime();
            Calendar c = Calendar.getInstance();
            c.setTime(start);

            Date start1 = c.getTime();
            calendar.setTime(start1);
            while (calendar.getTime().before(end)) {
                // 取出时间范围内的日期
                String day = dateFormat.format(calendar.getTime());
                //如果L1b_dataPath，GEO_dataPath都存在
                //if (ifFileExists(L1b_dataPath, day) && ifFileExists(GEO_dataPath, day)) {
                    //存入list
                    date.add(day.replace("/", ""));
               // }
                calendar.add(Calendar.DAY_OF_MONTH, 1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return date;
    }

    /**
     * 文件目录是否存在
     *
     * @param pathHead
     * @param time
     * @return
     */
    public boolean ifFileExists(String pathHead, String time) {
        boolean fileExists = false;
        String[] begin = time.split("/");
        String path = pathHead + begin[0];
        String dayPath = begin[0] + begin[1] + begin[2];
        File year_file = new File(path);
        if (year_file.exists()) {
            path += "/" + dayPath;
            File day_file = new File(path);
            if (day_file.exists()) {
                fileExists = true;
            }
        }
        return fileExists;
    }

    /**
     * 新增作业流->选择进程类型->显示类型下所有进程
     *
     * @param pageParamForPage
     * @return 进程
     */
    @Override
    public Page<Map<String, Object>> getProcess(Map<String, Object> pageParamForPage) {
        if (null == pageParamForPage.get("pageSize") || null == pageParamForPage.get("pageNumber")) {
            return null;
        }
        Map<String, Object> condition = new HashMap<String, Object>();
        String filed = " int_name,int_version,int_id,int_type,int_leadtime";
        condition = (Map<String, Object>) pageParamForPage.get("param");
        return JobSchedulerDaoImpl.queryProcessList(condition, filed, (Integer) pageParamForPage.get("pageNumber"), (Integer) pageParamForPage.get("pageSize"));
    }

    /**
     * 查询用户已有作业流下的进程详细信息
     *
     * @param obj
     * @return
     */
    @Override
    public List<Map<String, Object>> getJobProcess(Map<String, Object> obj) {
        String userName = obj.get("userName").toString();
        String[] jobProcess = obj.get("jobProcess").toString().split(",");
        List<Object> processIdList = new ArrayList<>();
        for (int i = 0; i < jobProcess.length; i++) {
            String processId = jobProcess[i].split("_")[0];
            processIdList.add(processId);
        }
        List<Map<String, Object>> process = JobSchedulerDaoImpl.userJobProcess(userName, processIdList);
        //插入执行顺序
        for (int i = 0; i < process.size(); i++) {
            process.get(i).put("int_step", i + 1);
            process.get(i).put("int_id", processIdList.get(i));
        }
        return process;
    }

    /**
     * 用户新增作业流
     *
     * @param obj
     * @return
     */
    @Override
    public boolean addJob(Map<String, Object> obj) {
        String userName = obj.get("userName").toString();
        String jobName = obj.get("jobName").toString();
        String jobType = obj.get("jobType").toString();
        String dataStartTime = obj.get("dataStartTime").toString();
        String dataEndTime = obj.get("dataEndTime").toString();
        SimpleDateFormat df = new SimpleDateFormat("yyyy/MM/dd HH:mm:ss");//设置日期格式
        String nowTime = df.format(new Date());// new Date()为获取当前系统时间
        List<String> jobProces = (List<String>) obj.get("jobProces");
        String process = jobProces.get(0);
        for (int i = 0; i < jobProces.size(); i++) {
            if (i > 0) {
                process += "," + jobProces.get(i);
            }
        }
        //将用户新增作业流信息存库
        return JobSchedulerDaoImpl.addJobData(userName, jobName, jobType, dataStartTime, dataEndTime, process, nowTime);
    }

    /**
     * 用户删除作业流
     *
     * @param obj
     * @return
     */
    @Override
    public boolean deleteJob(Map<String, Object> obj) {
        return JobSchedulerDaoImpl.deleteJobData(obj);
    }

    /**
     * 获得websockt主题
     *
     * @return
     */
    public String getTopicPath() {
        return topicPath;
    }

    /**
     * 设置websockt主题
     *
     * @param topicPath
     */
    @Override
    public void setTopicPath(String topicPath) {
        this.topicPath = topicPath;
    }

    /**
     * 生成配置文件主方法
     */
    @Override
    public boolean execMain(Map<String, Object> jobData) throws ParseException {
        //获取map（数据库配置文件模版，日期集合，始末时间）
        List<String> dateList = (List<String>) jobData.get("dateList");    //日期集合
        Map<String, String> rangeDate = (Map<String, String>) jobData.get("rangeMap"); //开始时间，结束时间
        Map<String, Object> configMap = (Map<String, Object>) jobData.get("configMap"); //配置文件
        String jobId = jobData.get("job_id").toString();
        Map<String, String> srcPath = (Map<String, String>) jobData.get("src_path");
        boolean runState = true;    // 作业流运行状态  false:运行出错  true:运行正常
        String outputPathSour = ((Map<String, String>)configMap.get("config_param")).get("fy3_mersi_CLM_data").toString();
        String outputPath = outputPathSour.substring(0, outputPathSour.indexOf("%id"));
        /*if(){
        	//循环日期
            for (int i = 0, num = dateList.size(); i < num; i++) {

                Map<String, String> paramForConfigMap = (Map<String, String>) configMap.get("config_param");//配置文件参数

                //调用海温转换（为null，跳过）
                Map<String, String> sstConfig = getConvertOisst(srcPath.get("SST"), getTopicPath(), paramForConfigMap.get("oisst_data_path"), dateList.get(i));

                if (null == sstConfig || 0 >= sstConfig.size()) {
                    continue;
                }
                paramForConfigMap.putAll(sstConfig);
                //将时间格式替换为具体时间
                paramForConfigMap = getConfigStr(paramForConfigMap, dateList.get(i), jobId);

                //获取时次文件
                Map<String, String> l1bListForDateMap = getFileNameForDate(paramForConfigMap.get("fy3_mersi_L1b_data"), dateList.get(i));
                Map<String, String> geoListForDateMap = getFileNameForDate(paramForConfigMap.get("fy3_mersi_GEO_data"), dateList.get(i));
                //始末特殊处理
                if (i == 0) {
                    l1bListForDateMap = fiterFileNameForDate(l1bListForDateMap, dateList.get(i), rangeDate.get("startTime"), 1);
                    geoListForDateMap = fiterFileNameForDate(geoListForDateMap, dateList.get(i), rangeDate.get("startTime"), 1);
                }
                if (i == num - 1) {
                    l1bListForDateMap = fiterFileNameForDate(l1bListForDateMap, dateList.get(i), rangeDate.get("endTime"), -1);
                    geoListForDateMap = fiterFileNameForDate(geoListForDateMap, dateList.get(i), rangeDate.get("endTime"), -1);
                }
                //循环时次
                for (String key : l1bListForDateMap.keySet()) {
                    if (null == geoListForDateMap.get(key)) {
                        continue;
                    }
                    Map<String, String> paramForConfigMapCopy = new HashMap<String, String>();
                    paramForConfigMapCopy.putAll(paramForConfigMap);
                    Map<String, String> finalL1bListForDateMap = l1bListForDateMap;
                    Map<String, String> finalGeoListForDateMap = geoListForDateMap;
                    configMap.put("config_param", dealConfigForMain(paramForConfigMapCopy, key, new HashMap<String, String>() {{
                        put("fy3_mersi_L1b_data", finalL1bListForDateMap.get(key));
                        put("fy3_mersi_GEO_data", finalGeoListForDateMap.get(key));
                    }}));
                    //生成配置文件字符串
                    configMap.put("date", key);
                    String configPath = createConfigForFile(configMap);
                    //调用执行
                    runState = !sshCommandExecutor.run_CLM(srcPath.get("CLM"), getTopicPath(), configPath);
                }
            }
        }else{*/
        	String stime="2017/04/20 01:00:00";
            String etime="2005/05/02 01:00:00";
            runState=!sshCommandExecutor.run_snc(srcPath.get("SNC"), getTopicPath(),stime);
       // }
        //将输出路径存库
        setOutputPath(Integer.parseInt(jobId), outputPath + jobId + "/");
        return runState;
    }

    /**
     * 将maplist转换为map
     *
     * @param mapList mapList
     * @return map
     */
    private Map<String, String> mapListToMap(List<Map<String, String>> mapList) {
        Map<String, String> result = new HashMap<String, String>();
        for (Map<String, String> map : mapList) {
            result.putAll(map);
        }
        return result;
    }

    private Map<String, String> dealConfigForMain(Map<String, String> paramForConfigMap, String dateStr, Map<String, String> fileNameMap) throws ParseException {
        String templateStr = "";
        for (String key : fileNameMap.keySet()) {
            templateStr = fileNameMap.get(key);
            break;
        }
        //处理输入参数
        paramForConfigMap = dealInputParam(paramForConfigMap, fileNameMap);
        //建立输出文件夹
        createDir(paramForConfigMap.get("fy3_mersi_CLM_data"));
        //处理输出参数
        paramForConfigMap = dealOutputParam(paramForConfigMap, templateStr);
        //处理特殊参数
        paramForConfigMap = dealSpecialParam(paramForConfigMap, null, dateStr);
        //处理引号问题
        paramForConfigMap = dealEndParam(paramForConfigMap);

        return paramForConfigMap;
    }

    /**
     * 建立文件夹（级联建立）
     *
     * @param path 路径
     */
    private void createDir(String path) {
        if (null == path || "".equals(path)) {
            return;
        }
        File file = new File(path);
        if (!file.exists()) {
            file.mkdirs();
        }
    }

    /**
     * 根据时间及路径获取文件
     *
     * @param path 路径
     * @param date 时间(yyyyMMdd)
     * @return
     */
    public Map<String, String> getFileNameForDate(String path, String date) {
        Map<String, String> result = new HashMap<String, String>();
        List<String> fileList = filterFile(getFileList(path), "HDF");
        for (String fileName : fileList) {
            result.putAll(getMap(fileName, date));
        }
        return result;
    }

    /**
     * 过滤时间范围之外的文件集合
     *
     * @param fileNameList 文件名集合
     * @param date         需要的日期(yyyyMMdd_hhmm)
     * @param rangeDate    时间范围(yyyy-MM-dd hh:mm:ss 或者其他)
     * @param isGreater    是否为大于
     * @return 过滤后的集合
     */
    private Map<String, String> fiterFileNameForDate(Map<String, String> fileNameList, String date, String rangeDate, int isGreater) {
        String rangeDateForNum = rangeDate.replaceAll("\\D", "");
        if (!date.equals(rangeDateForNum.substring(0, 8))) {
            return fileNameList;
        }
        Map<String, String> result = new HashMap<String, String>();
        for (String key : fileNameList.keySet()) {
            int compareResult = compareNum(Integer.parseInt(key.substring(9, 13)), Integer.parseInt(rangeDateForNum.substring(8, 12)));
            if (compareResult == 0) {
                result.put(key, fileNameList.get(key));
            }
            if (isGreater * compareResult > 0) {
                result.put(key, fileNameList.get(key));
            }
        }
        return result;
    }

    /**
     * 比较数字大小
     *
     * @param data1 数字1
     * @param data2 数字2
     * @return
     */
    public static int compareNum(int data1, int data2) {
        if (data1 == data2) {
            return 0;
        } else if (data1 > data2) {
            return 1;
        } else {
            return -1;
        }
    }

    /**
     * 生成配置文件字符串
     */
    public String createConfigForFile(Map<String, Object> contentMap) {
        BufferedWriter bw = null;
        String txtpath = null;
        try {
            File dir = new File(contentMap.get("config_path").toString() + contentMap.get("date").toString().substring(0, 4) + "/");
            if (!dir.exists()) {
                dir.mkdirs();
            }
            txtpath = dir.getAbsolutePath() + "/" + contentMap.get("date") + ".in";
            bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(txtpath)));
            bw.write(contentMap.get("config_head").toString());
            Map<String, String> paramMap = (Map<String, String>) contentMap.get("config_param");
            for (String key : paramMap.keySet()) {
                bw.write("\n");
                bw.write(key + "=" + paramMap.get(key));
            }

            bw.write(contentMap.get("config_foot").toString());
            bw.flush();
            bw.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return txtpath;
    }

    /**
     * 将配置文件中时间格式符替换为具体时间
     *
     * @param configMap 原配置文件
     * @param date      时间字符串
     * @return 处理后的配置文件map（将时间格式替换为具体时间的map）
     * @throws ParseException 正则化错误
     */
    private Map<String, String> getConfigStr(Map<String, String> configMap, String date, String id) throws ParseException {
        Map<String, String> dataMap = getDateMap(date + "_0000", "(\\d{4})(\\d{2})(\\d{2})_(\\d{2})(\\d{2})");
        for (String key : configMap.keySet()) {
            for (String dateKey : dataMap.keySet()) {
                configMap.put(key, configMap.get(key).replaceAll(dateKey, dataMap.get(dateKey)));
            }
            //加id
            configMap.put(key, configMap.get(key).replaceAll("%id", id));

        }
        return configMap;
    }

    /**
     * 处理输入参数
     *
     * @param configMap 配置文件参数map
     * @return 配置文件参数map
     */
    private Map<String, String> dealInputParam(Map<String, String> configMap, Map<String, String> fileNameMap) {
        String[] inputFileds = splitFileName(SystemConstants.CML.get("inputFiled"), ",");
        for (String key : inputFileds) {
            configMap.put(key, configMap.get(key) + fileNameMap.get(key));
        }
        return configMap;
    }

    /**
     * 处理输出参数
     *
     * @param configMap 配置文件参数map
     * @return 转换后的配置文件参数map
     */
    private Map<String, String> dealOutputParam(Map<String, String> configMap, String templateStr) {
        String[] outputFileds = splitFileName(SystemConstants.CML.get("outputFiled"), ",");
        for (String key : outputFileds) {
            String[] keySplits = splitFileName(key, "_");
            if (keySplits.length > 3) {
                String fileNameStr = templateStr.replaceAll("1000M", keySplits[2] + "XX");
                fileNameStr = templateStr.replaceAll("GEO1K", keySplits[2] + "XX");
                fileNameStr = fileNameStr.replaceAll("L1", "L2");
                configMap.put(key, configMap.get(key) + fileNameStr);
            } else {
                //处理fy3_intermediate
                String fileNameStr = templateStr.replaceAll("1000M_MS", "INTERMED");
                configMap.put(key, configMap.get(key) + fileNameStr);
            }
        }
        return configMap;
    }

    /**
     * 处理特殊参数
     *
     * @param configMap 配置文件参数map
     * @return 转换后的配置文件参数map
     */
    private Map<String, String> dealSpecialParam(Map<String, String> configMap, Map<String, String> templateMap, String dateStr) throws ParseException {
        Map<String, String> dataMap = getDateMap(dateStr, "(\\d{4})(\\d{2})(\\d{2})_(\\d{2})(\\d{2})");
        int hh = Integer.parseInt(dataMap.get("%hh"));
        String datatime = dataMap.get("%yyyy") + dataMap.get("%mm") + dataMap.get("%dd");
        String data1 = hh / 6 * 6 < 10 ? "0" + hh / 6 * 6 : "" + hh / 6 * 6;
        String data2 = hh / 6 * 6 + 6 < 10 ? "" + hh / 6 * 6 + 6 : "" + hh / 6 * 6 + 6;
        if (hh / 6 * 6 + 6 == 24) {
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyyMMdd");
            Date date = simpleDateFormat.parse(datatime);
            datatime = simpleDateFormat.format(getNextDay(date, -1));
        }
        configMap.put("nwp_grib_data1", configMap.get("nwp_grib_data1") + "fnl_" + datatime + "_" + data1 + "_00.grib1");
        configMap.put("nwp_grib_data2", configMap.get("nwp_grib_data2") + "fnl_" + datatime + "_" + data2 + "_00.grib1");
        return configMap;
    }

    /**
     * 设置产品输出路径
     *
     * @param job_id
     * @param outputPath
     */
    private void setOutputPath(Integer job_id, String outputPath) {
        Map<String, Object> updateParam = new HashMap<>();
        updateParam.put("job_id", job_id);
        updateParam.put("job_outputpath", outputPath);
        JobSchedulerDaoImpl.updateJobTable(updateParam);
    }

    /**
     * 处理双引号问题
     *
     * @param configMap 配置文件参数map
     * @return 转换后的配置文件参数map
     */
    private Map<String, String> dealEndParam(Map<String, String> configMap) {
        for (String key : configMap.keySet()) {
            if (configMap.get(key).indexOf("/") != -1) {
                configMap.put(key, "\"" + configMap.get(key) + "\"");
            }
            continue;
        }
        return configMap;
    }

    /**
     * 根据时间字符串及正则表达式获取年月日信息
     *
     * @param date      时间字符串
     * @param formatStr 正则表达式（例如 yyyyMMdd_hhmm 为 (\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})）
     * @return 年月日时分
     * @throws ParseException
     */
    public Map<String, String> getDateMap(String date, String formatStr) throws ParseException {
        Pattern p = Pattern.compile(formatStr);
        Matcher m = p.matcher(date);
        if (m.find()) {
            return new HashMap<String, String>() {{
                put("%yyyy", m.group(1));
                put("%mm", m.group(2));
                put("%dd", m.group(3));
                put("%hh", m.group(4));
                put("%mi", m.group(5));
            }};
        } else {
            return null;
        }
    }

    /**
     * 获取map-根据时次命名-文件名
     *
     * @param fileName 文件名
     * @param date     时间
     * @return map集合
     */
    private Map<String, String> getMap(String fileName, String date) {
        String[] names = splitFileName(fileName, "_");
        if (names.length < 6) {
            return null;
        }
        String key = date + "_" + names[5];

        return new HashMap<String, String>() {{
            put(key, fileName);
        }};
    }

    /**
     * 判断文件是否存在
     *
     * @param path 文件路径
     * @return 是否存在
     */
    private boolean isFileExist(String path) {
        File file = new File(path);
        if (file.exists()) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * 获取前n天时间
     *
     * @param date 当前时间
     * @return 前n天时间
     */
    public Date getNextDay(Date date, int dayNum) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(date);
        calendar.add(Calendar.DAY_OF_MONTH, -dayNum);
        date = calendar.getTime();
        return date;
    }

    /**
     * 得到目录下文件集合
     *
     * @param path 文件路径
     * @return 文件名集合
     */
    @Override
    public List<String> getFileList(String path) {
        File file = new File(path);
        if (file.exists()) {
            return Arrays.asList(file.list());
        } else {
            return null;
        }
    }

    @Override
    public void test(String topicPath) {

    }

    /**
     * 根据文件类型过滤文件
     *
     * @param fileList 文件名集合
     * @param fileType 文件类型
     * @return 过滤后的文件
     */
    private List<String> filterFile(List<String> fileList, String fileType) {
        if (fileType == null) {
            return fileList;
        }
        List<String> result = new ArrayList<String>();
        for (String file : fileList) {
            int index = file.lastIndexOf(".");
            if (index != -1 && fileType.equals(file.substring(index + 1))) {
                result.add(file);
            }
        }
        return result;
    }

    /**
     * 切分文件名
     *
     * @param fileName 文件名
     * @param splitStr 切分字符串
     * @return 切分后集合
     */
    private String[] splitFileName(String fileName, String splitStr) {
        if (splitStr == null || fileName.indexOf(splitStr) == -1) {
            return new String[]{fileName};
        }
        return fileName.split(splitStr);
    }

    /**
     * 调用海温转换shell生成,产生输出文件：提供方法（入参是时次），返回值是该时次对应的输入文件：
     * 如入参：
     *
     * @param sourcePath                       源码路径。 如： /home/huxq/FYLAT/
     * @param topicPath                        :表示websocket主题路径
     * @param oisst_data_path                  :用户输入的kv
     * @param timeLevel:每个时次如："20160501_0005"； 出参：
     *                                         oisst_data_path     ="/home/huxq/FYLAT/data/SST/DAILY/2016/",
     *                                         oisst_data          ="/home/huxq/FYLAT/data/SST/DAILY/2016/sst.day.mean.20160429.hdf5",
     * @return 如果是空串，说明执行出错，continue出去，执行另一天的数据
     */
    public Map<String, String> getConvertOisst(String sourcePath, String topicPath, String oisst_data_path, String timeLevel) {
        //bash /home/huxq/FYLAT/script/CLM/run_sst_java.sh /home/huxq/FYLAT/data/SST/ORG/ /home/huxq/FYLAT/data/SST/DAILY/2017/ 20170501
        String rsOisst = "";
        Map<String, String> config = new HashMap<String, String>();
        String year_subtract_2day = getYear(timeLevel);
        oisst_data_path = oisst_data_path.replace("%yyyy", year_subtract_2day);
        String inpath = "/home/huxq/FYLAT/data/SST/ORG/";
        String outpath = "/home/huxq/FYLAT/data/SST/DAILY/" + timeLevel.substring(0, 4) + "/";
        String oisst_data = sshCommandExecutor.run_sst(sourcePath, topicPath, inpath, outpath, timeLevel);
        if (!StringUtils.isEmpty(oisst_data)) {
            config.put("oisst_data_path", oisst_data_path);
            config.put("oisst_data", oisst_data);
        }
        return config;
    }

    private String getYear(String timeLevel) {
        Date timeDate = DateUtil.strToDate(timeLevel.replaceAll("\\D", ""), "yyyyMMdd");
        Calendar cur = Calendar.getInstance();
        cur.setTime(timeDate);
        cur.add(Calendar.DAY_OF_MONTH, -2);
        return DateUtil.formatDateTime(cur.getTime(), "yyyy");
    }

    /*// 回显测试方法
    public void test(String topicPath) {
        for(int i = 1; i <= 50; i++) {
            messagingTemplate.convertAndSend(topicPath, "aaaaaa");
            try {
                sleep(1000); //暂停，每一秒输出一次
            } catch (InterruptedException e) {
                return;
            }
        }
    }*/
}
