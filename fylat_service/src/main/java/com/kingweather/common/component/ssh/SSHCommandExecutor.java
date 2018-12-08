package com.kingweather.common.component.ssh;

import com.jcraft.jsch.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import javax.annotation.Resource;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.InputStreamReader;
import java.util.LinkedList;
import java.util.List;

/**
 * This class provide interface to execute command on remote Linux.
 */
@Component
public class SSHCommandExecutor {
    Logger logger = LoggerFactory.getLogger(this.getClass());
    @Resource
    private SimpMessagingTemplate messagingTemplate;


    @Value("${liunx.ipAddress}")
    private String ipAddress;
    @Value("${liunx.username}")
    private String username;
    @Value("${liunx.password}")
    private String password;
    @Value("${liunx.port}")
    private int port;



    public SSHCommandExecutor() {
    }

    public SSHCommandExecutor(final String ipAddress, final String username, final String password, Integer port) {
        this.ipAddress = ipAddress;
        this.username = username;
        this.password = password;
        this.port = port;
    }


    public Session getSession() {
        JSch jsch = new JSch();
        MyUserInfo userInfo = new MyUserInfo();
        // Create and connect session.
        Session session = null;
        try {
            session = jsch.getSession(username, ipAddress, port);
            session.setPassword(password);
            session.setUserInfo(userInfo);
            session.connect();
        } catch (JSchException e) {
            e.printStackTrace();
        }
        return session;
    }

    /**
     * @param command   脚本的绝对路径
     * @param topicPath webscoket主题路径
     * @return 如果脚本执行有错误，返回值是true
     */
    public boolean execute(final String command, String topicPath) {
        boolean tag = false;
        Session session = getSession();
        try {

            Channel channel = session.openChannel("exec");
            logger.info("The remote command is: " + command);
            ((ChannelExec) channel).setCommand(command);
            channel.setInputStream(null);

            ByteArrayOutputStream memory = new ByteArrayOutputStream();
            ((ChannelExec) channel).setErrStream(memory);
            BufferedReader input = new BufferedReader(new InputStreamReader(channel.getInputStream()));
            channel.connect();
            // Get the output of remote command.
            String line;
            while ((line = input.readLine()) != null) {
                tag = isErrorInfo(line);
                messagingTemplate.convertAndSend(topicPath, line);
                if (memory.size() != 0) {
                    tag = true;
                    messagingTemplate.convertAndSend(topicPath, "error:" + new String(memory.toByteArray(), "utf-8"));
                    memory.reset();
                }
            }
            input.close();
            // Get the return code only after the channel is closed.
            if (channel.isClosed()) {
                int returnCode = channel.getExitStatus();
            }
            // Disconnect the channel and session.
            channel.disconnect();
            session.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return tag;
    }
    /**
     * 判断字符串是否有错误关键词,如果有则返回true
     */
    private boolean isErrorInfo(String line){
        return line.toLowerCase().matches(".*error.*");
    }
    /**
     * @param sourcePath 源码路径：  /home/huxq/FYLAT/
     * @param topicPath webscoket主题路径
     *@param configPath 云检测配制文件
     * 云检测,如果执行成功返回true
     */
    public boolean run_CLM(String sourcePath, String topicPath,String configPath){
        String command ="bash "+sourcePath+"run_CLM_java.sh "+configPath;
        return execute(command,topicPath);
    }
    /**
     * 积雪方法
     * @param sourcePath
     * @param topicPath
     * @param configPath
     * @return
     */
    public boolean run_snc(String sourcePath, String topicPath,String stime){
        //String command ="bash "+sourcePath+"run_SNC_java.sh "+stime;
    	String command ="bash "+sourcePath+"run_SNC_java.sh ";
        return execute(command,topicPath);
    }
    /**
     * @param sourcePath 源码路径：  /home/huxq/FYLAT/
     * 海温转换
     *  [huxq@oa-kyfz-th-c2-15 CLM]$ bash /home/huxq/FYLAT/script/CLM/run_sst_java.sh /home/huxq/FYLAT/data/SST/ORG/ /home/huxq/FYLAT/data/SST/DAILY/2017/ 20170501 | tee sst.log
        [huxq@oa-kyfz-th-c2-15 CLM]$ grep -i "error" sst.log | wc -l
        6
        返回值是否含有错误信息，如果没有说明转换成功：
     */
    public String run_sst(String sourcePath,String topicPath,String inpath,String outPath,String timeLevel){
        String command = "bash " +sourcePath+ "run_sst_java.sh " +
                " "+inpath+" "+outPath+" "+timeLevel+"";
        boolean isErrorInfo = execute(command,topicPath);
        String filePath ="";
        //如果没有错误信息，则取出输出文件名
        if(!isErrorInfo){
            List<String> fileNameInfo = execute("grep 'out_file =' "+sourcePath+"sst.log | awk -F '/' '{print $NF}'");
            if(fileNameInfo.size()>0){
                filePath = outPath + fileNameInfo.get(0);
            }
        }
        return filePath;
    }

    /**
     * 代码编译
     * @param sourcePath: 源码路径 如：/home/huxq/FYLAT/
     * @param topicPath:websocket主题路径
     * @param intType:每类进程的标识，SST：海温转换，CLM：云检测
     */
    public void makeFile(String sourcePath,String topicPath,String intType){
    	String shellStr;
    	if("snc".equals(intType.toLowerCase())){
    		 shellStr = GeneratorShell.makeFileShellC(sourcePath);
    	}else{
    		 shellStr = GeneratorShell.makeFileShell(sourcePath);
    	}
        if("sst".equals(intType.toLowerCase())){
            String sstShell = GeneratorShell.runSstShell(sourcePath);
            GeneratorShell.writeShell(sstShell,sourcePath,"run_sst_java");
        }else if("clm".equals(intType.toLowerCase())){
            String clmShell = GeneratorShell.runClmShell(sourcePath);
            GeneratorShell.writeShell(clmShell,sourcePath,"run_CLM_java");
        }else if("snc".equals(intType.toLowerCase())){
        	String sncShell=GeneratorShell.runSncShell(sourcePath);
        	GeneratorShell.writeShell(sncShell, sourcePath, "run_SNC_java");
        	
        }
        String shellpath = "bash "+GeneratorShell.writeShell(shellStr,sourcePath,"makeFile");
        execute(shellpath,topicPath);
    }




    public List<String> execute(final String command) {
        int returnCode = 0;
        Session session = getSession();
        List<String> list = new LinkedList<>();
        try {

            Channel channel = session.openChannel("exec");
            logger.info("The remote command is: " + command);
            //执行指定的shell命令
            ((ChannelExec) channel).setCommand(command);
            //设置输入流到channel中，管道会读取输入流的数据
            channel.setInputStream(null);


            //FileOutputStream fos=new FileOutputStream("/tmp/stderr");
            //((ChannelExec)channel).setErrStream(fos);
            ((ChannelExec) channel).setErrStream(System.err);
            BufferedReader input = new BufferedReader(new InputStreamReader(channel
                    .getInputStream()));

            channel.connect();
            // Get the output of remote command.
            String line;
            while ((line = input.readLine()) != null) {
                list.add(line);

            }
            input.close();
            // Get the return code only after the channel is closed.
            if (channel.isClosed()) {
                returnCode = channel.getExitStatus();
            }
            // Disconnect the channel and session.
            channel.disconnect();
            session.disconnect();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return list;
    }


    /*public static void main(final String[] args) {
        //SSHCommandExecutor sshExecutor = new SSHCommandExecutor("106.74.36.77", "kingweather", "Gyf7Ez");
        //sshExecutor.execute("/usr/local/bin/gdal2tiles.py -s EPSG:4326  /data/business/AHI8_20171002_0810_1KM.tiff /data/business/testshell");
        SSHCommandExecutor sshExecutor = new SSHCommandExecutor("192.168.4.41", "root", "123456", 22);
        List<String> stdout = sshExecutor.execute("grep 'out_file =' /data/tool/bashShell/sst.log | awk -F '/' '{print $NF}'");
        for (String str : stdout) {
            System.out.println("===========>"+str);
        }
        //sshExecutor.makeFile("/home/huxq/FYLAT/src/CLM/ConvertOisst","/topic/super/aaa");
    }*/
}

/**
 * This class provide interface to feedback information to the user.
 */
class MyUserInfo implements UserInfo {
    Logger logger = LoggerFactory.getLogger(this.getClass());
    private String password;

    private String passphrase;

    @Override
    public String getPassphrase() {
        logger.info("MyUserInfo.getPassphrase()");
        return null;
    }

    @Override
    public String getPassword() {
        logger.info("MyUserInfo.getPassword()");
        return null;
    }

    @Override
    public boolean promptPassphrase(final String arg0) {
        logger.info("MyUserInfo.promptPassphrase()");
        logger.info(arg0);
        return false;
    }

    @Override
    public boolean promptPassword(final String arg0) {
        logger.info("MyUserInfo.promptPassword()");
        logger.info(arg0);
        return false;
    }

    @Override
    public boolean promptYesNo(final String arg0) {
        /*logger.info("MyUserInfo.promptYesNo()");
        logger.info(arg0);*/
        if (arg0.contains("The authenticity of host")) {
            return true;
        }
        return false;
    }

    @Override
    public void showMessage(final String arg0) {
        logger.info("MyUserInfo.showMessage()");
    }
}