package com.kingweather.fylat_service.service.integrationManage.impl;

import com.kingweather.common.component.ssh.SSHCommandExecutor;
import com.kingweather.common.util.FileZip;
import com.kingweather.common.util.JsonParserUtil;
import com.kingweather.common.util.Page;
import com.kingweather.common.util.RandomGUID;
import com.kingweather.fylat_service.dao.ConfigDao;
import com.kingweather.fylat_service.dao.IntegrationManageDao;
import com.kingweather.fylat_service.service.integrationManage.IntegrationService;
import org.apache.tomcat.util.http.fileupload.FileUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by handongchen on 2017/12/18.
 */
@Service("integrationService")
public class IntegrationServiceImpl implements IntegrationService {
    @Resource
    private IntegrationManageDao integrationManageDao;
    @Resource
    private ConfigDao configDao;
    @Resource
    private SSHCommandExecutor sshCommandExecutor;
   /* @Resource
    private SimpMessagingTemplate messagingTemplate;*/

    @Override
    @Transactional
    public String addIntegration(Map<String, Object> pageParam) {
        Object[] baseMsg = getArgsForIntegration(mapToObject(pageParam.get("baseMsg")));
        int addBase = integrationManageDao.addIntegration(baseMsg);
        int addConfig = configDao.add(getArgsForConfig(mapToObject(pageParam.get("configMsg")), baseMsg[0]));
        if (addBase > 0 && addConfig > 0) {
            return "access";
        } else {
            return "sql exec 0";
        }
    }

    @Override
    @Transactional
    public String updateIntegration(Map<String, Object> pageParam) {
        if (null == pageParam || null == pageParam.get("baseMsg") || null == pageParam.get("configMsg")) {
            return null;
        }

        int updateBase = integrationManageDao.update(dealIntegrationArgsForUpdate(pageParam));
        int updateConfig = configDao.update(dealConfigArgsForUpdate(pageParam));
        if (updateBase > 0 && updateConfig > 0) {
            return "access";
        } else {
            return "sql exec 0";
        }
    }

    @Override
    public Page<Map<String, Object>> queryIntegrationPage(Map<String, Object> pageParamForPage) {
        if (null == pageParamForPage.get("pageSize") || null == pageParamForPage.get("pageNumber")) {
            return null;
        }

        Map<String, Object> condition = new HashMap<String, Object>();
        String filed = " int_id,int_name,int_version,int_version_explain,int_state,int_type,int_belong_user,int_src_path,int_project_type,int_language,int_createtime,int_leadtime";

        condition = (Map<String, Object>) pageParamForPage.get("param");


        return integrationManageDao.queryIntegrationList(condition, filed, (Integer) pageParamForPage.get("pageNumber"), (Integer) pageParamForPage.get("pageSize"));
    }

    @Override
    public Map<String, Object> queryIntegrationForId(Map<String, Object> pageParamForPage) {
        if (null == pageParamForPage.get("int_id") || "".equals(pageParamForPage.get("int_id"))) {
            return null;
        }
        String filed = " int_id,int_name,int_version,int_version_explain,int_state,int_type,int_belong_user,int_src_path,int_project_type,int_language";
        Map<String, Object> integration = integrationManageDao.queryIntegrationForId(pageParamForPage, filed);
        Map<String, Object> config = configDao.queryForIntegration(new HashMap<String, Object>() {{
            put("config_belong_int", pageParamForPage.get("int_id"));
        }}, "config_id,config_belong_int,config_head,config_foot,config_param,config_path");

        return new HashMap<String, Object>() {{
            put("integration", integration);
            put("config", config);
        }};
    }

    @Override
    public String complieIntegration(Map<String, Object> conditionForPage) throws Exception {
        String zipPath = conditionForPage.get("filePath").toString();
        String toPath = zipPath.substring(0, zipPath.lastIndexOf("/")) + "/";
        FileZip.unZip(toPath, zipPath);
        deleteFile(zipPath);
        String result = toPath + zipPath.substring(zipPath.lastIndexOf("/") + 1, zipPath.lastIndexOf(".")) + "/";
        //test(conditionForPage.get("topic").toString());
        sshCommandExecutor.makeFile(result, conditionForPage.get("topic").toString(), conditionForPage.get("intType").toString());
        return result;

    }

    /* public void test(String topicPath) {
         messagingTemplate.convertAndSend(topicPath, "error:aaaaaa");
     } */

    @Override
    @Transactional
    public String deleteIntegration(Map<String, Object> conditionForPage) throws IOException {
        List<Map<String, Object>> dataList = (List<Map<String, Object>>) conditionForPage.get("data");
        //删除源码
        for (Map<String, Object> map : dataList) {
            String path = map.get("int_src_path").toString();
            if ("/home/huxq/".equals(path)) {
                deleteFile(path);
            }

        }
        //删除配置文件
        List<Object[]> result = getArgsOfIdsForIntegration(dataList);
        configDao.delete(result);
        //修改进程信息状态
        integrationManageDao.deleteIntegration(result);
        return "删除成功";
    }

    //-------------------------类内通用方法---------------------------------

    /**
     * map形式的object转map
     *
     * @param args 参数
     * @return 结果
     */
    private Map<String, Object> mapToObject(Object args) {
        return (Map<String, Object>) args;

    }

    /**
     * 删除文件
     *
     * @param filePath 文件路径
     * @throws IOException
     */
    private void deleteFile(String filePath) throws IOException {
        File file = new File(filePath);
        if (file.exists()) {
            FileUtils.forceDelete(file);
        }
    }

    /**
     * 将网页接受的数据转换为数据库需要的格式(删除进程信息)
     *
     * @param mapList 网页传过来的数据
     * @return 数据库需要的数据格式
     */
    private List<Object[]> getArgsOfIdsForIntegration(List<Map<String, Object>> mapList) {
        List<Object[]> result = new ArrayList<Object[]>();
        for (Map<String, Object> map : mapList) {
            result.add(new Object[]{map.get("int_id")});
        }
        return result;
    }

    /**
     * 将网页传过来的map转换为占位符需要的格式（新增进程）
     *
     * @param map 页面传过来的
     * @return 占位符需要的格式
     */
    private Object[] getArgsForIntegration(Map<String, Object> map) {
        RandomGUID myGUID = new RandomGUID();
        String id = myGUID.toString();
        Object[] args = new Object[]{
                id,
                map.get("int_name"),
                map.get("int_version"),
                map.get("int_version_explain"),
                ((Map<String, Object>) map.get("int_type")).get("id"),
                ((Map<String, Object>) map.get("int_project_type")).get("id"),
                map.get("int_belong_user"),
                //JsonParserUtil.toJson(map.get("int_output_path")),
                map.get("int_src_path"),
                map.get("int_language")
        };
        return args;
    }

    /**
     * 将网页传过来的map转换为占位符需要的格式（新增配置文件）
     *
     * @param map 页面传过来的
     * @return 占位符需要的格式
     */
    private Object[] getArgsForConfig(Map<String, Object> map, Object intId) {
        Object[] args = new Object[]{
                map.get("config_head"),
                map.get("config_foot"),
                JsonParserUtil.toJson(map.get("config_param")),
                map.get("config_path"),
                intId
        };
        return args;
    }

    private Map<String, Object> dealIntegrationArgsForUpdate(Map<String, Object> data) {
        Map<String, Object> result = (Map<String, Object>) data.get("baseMsg");
        result.put("int_project_type", ((Map<String, Object>) result.get("int_project_type")).get("id"));
        result.put("int_type", ((Map<String, Object>) result.get("int_type")).get("id"));
        //result.put("int_output_path", JsonParserUtil.toJson(result.get("int_output_path")));
        return result;
    }

    private Map<String, Object> dealConfigArgsForUpdate(Map<String, Object> data) {
        Map<String, Object> result = (Map<String, Object>) data.get("configMsg");
        result.put("config_param", JsonParserUtil.toJson(result.get("config_param")));
        return result;

    }
}
