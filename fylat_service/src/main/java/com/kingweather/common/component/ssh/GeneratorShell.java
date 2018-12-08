package com.kingweather.common.component.ssh;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStreamWriter;

/**
 * Created by luyl on 2018/1/3.
 */
public class GeneratorShell {
    /**
     * 生成海温转换脚本
     * @param sourceCodePath:表示源码路径：/home/huxq/FYLAT/
     */
    public static String runSstShell(String sourceCodePath){
        String shell ="#!/bin/bash\n" +
                "#source clm.env\n" +
                "INTEL_PATH=/opt/intel\n" +
                "source ${INTEL_PATH}/bin/compilervars.sh intel64\n" +
                "ROOT_PATH=~/FYLAT\n" +
                "PATH=$PATH:$ROOT_PATH/lib/intel_lib/bin\n" +
                "LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ROOT_PATH/lib/intel_lib/lib\n" +
                "\n" +
                "\n" +
                "#ipath=/home/huxq/FYLAT/data/SST/ORG\n" +
                "ipath=$1\n" +
                "opath=$2\n" +
                "timeLevel=$3\n" +
                "#/home/huxq/FYLAT/bin/CLM/convert_oisst_year2daily.exe $ipath/ $opath/2004/ 20050101\n" +
                sourceCodePath+"bin/convert_oisst_year2daily.exe $ipath/ $opath $timeLevel | tee "+sourceCodePath+"sst.log";
        return shell;
    }
    /**
     * 生成云检测脚本
     * @param sourceCodePath:表示源码路径：/home/huxq/FYLAT/
     */
    public static String runClmShell(String sourceCodePath){
        String shell ="#!/bin/bash\n" +
                "#===============================================================\n" +
                "# Name:        main_run_cloud.sh\n" +
                "# author:      wangpeng\n" +
                "# Version:     0.0.1\n" +
                "# Date:        2017-03-16\n" +
                "# Description: 运行云检测程序\n" +
                "# Input:       \n" +
                "#     1、日期(YYYYMMDD)\n" +
                "#     2、时分(HHMM)\n" +
                "# OutPut:      \n" +
                "#     1、转换后的海面温度产品(nc年产品转换到hdf5的日产品)\n" +
                "#     2、云检测产品\n" +
                "#===============================================================\n" +
                "\n" +
                "\n" +
                "# 加载环境变量\n" +
                "#source clm.env\n" +
                "INTEL_PATH=/opt/intel\n" +
                "source ${INTEL_PATH}/bin/compilervars.sh intel64\n" +
                "ROOT_PATH=~/FYLAT\n" +
                "CONFIG_PATH=$1\n" +
                "PATH=$PATH:$ROOT_PATH/lib/intel_lib/bin\n" +
                "LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ROOT_PATH/lib/intel_lib/lib\n" +
                "\n" +
                "#./FYLAT_FY3_MERSI_CLM.exe $ROOT_PATH/config/CLM/2005/20050101_0730.in\n" +
                sourceCodePath+"bin/FYLAT_FY3_MERSI_CLM.exe $CONFIG_PATH";
        return shell;
    }
    /**
     * 积雪脚本
     * @param sourceCodePath
     * @return
     */
    public static String runSncShell(String sourceCodePath){
        String shell ="#!/bin/bash\n" +
                "#===============================================================\n" +
                "# Name:        main_run_cloud.sh\n" +
                "# author:      wangpeng\n" +
                "# Version:     0.0.1\n" +
                "# Date:        2017-03-16\n" +
                "# Description: 运行云检测程序\n" +
                "# Input:       \n" +
                "#     1、日期(YYYYMMDD)\n" +
                "#     2、时分(HHMM)\n" +
                "# OutPut:      \n" +
                "#     1、转换后的海面温度产品(nc年产品转换到hdf5的日产品)\n" +
                "#     2、云检测产品\n" +
                "#===============================================================\n" +
                "\n" +
                "\n" +
                "# 加载环境变量\n" +
                "#source clm.env\n" +
                "INTEL_PATH=/opt/intel\n" +
                "source ${INTEL_PATH}/bin/compilervars.sh intel64\n" +
                "ROOT_PATH=~/FYLAT\n" +
                "#stime=$1\n"+
                "#etime=$2\n"+
                "#CONFIG_PATH=/home/huxq/FYLAT/config/MSWD/2017/${stime:0:6}/${stime}.standalone\n" +
                "CONFIG_PATH=/home/huxq/FYLAT/config/MSWD/2017/201704/20170420.standalone\n" +
                "PATH=$PATH:$ROOT_PATH/lib/intel_lib/bin\n" +
                "LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$ROOT_PATH/lib/intel_lib/lib\n" +
                "\n" +
                "#./FYLAT_FY3_MERSI_CLM.exe $ROOT_PATH/config/CLM/2005/20050101_0730.in\n" +
                sourceCodePath+"Debug/MSWD_F3D $CONFIG_PATH 0 0 17 35";
        return shell;
    }

    /**
     *
     * @param sourcePath:编译的源码路径：如：/home/huxq/FYLAT/
     * @return
     */
    public static String makeFileShell(String sourcePath){
        StringBuffer shellStr = new StringBuffer();
        String check_ok ="#!/bin/bash\n" +
                "check_ok() {\n" +
                "\tif [ $? != 0 ]\n" +
                "\tthen\n" +
                "\t    echo \"Error, Check the error log.\"\n" +
                "\t    exit 1\n" +
                "\tfi\n" +
                "}\n";
        shellStr.append(check_ok)
                .append("cd "+sourcePath+"src\n")
                .append("make clean && make \n")
                .append("check_ok");

        return shellStr.toString();
    }
    /**
     * c语言编译源码路径
     * @param sourcePath
     * @return
     */
    public static String makeFileShellC(String sourcePath){
        StringBuffer shellStr = new StringBuffer();
        String check_ok ="#!/bin/bash\n" +
                "check_ok() {\n" +
                "\tif [ $? != 0 ]\n" +
                "\tthen\n" +
                "\t    echo \"Error, Check the error log.\"\n" +
                "\t    exit 1\n" +
                "\tfi\n" +
                "}\n";
        shellStr.append(check_ok)
                .append("cd "+sourcePath+"Debug\n")
                .append("make clean && make \n")
                .append("check_ok");

        return shellStr.toString();
    }

    /**
     * 生脚本的工具方法
     * @param shellStr ：脚本的内容
     * @param sourcePath ：脚本生成所在目录：如：/home/huxq/FYLAT/
     * @param shellName ：脚本的名称
     * @return
     */
    public static String writeShell(String shellStr,String sourcePath,String shellName) {
        //  /data/tool/bashShell/for2.sh
        String shellPath ="";
        try {
            //String bashPath = "e:/spark_test";
            File bashFile = new File(sourcePath);
            if(!bashFile.exists()){
                bashFile.mkdirs();
            }
            shellPath = sourcePath + shellName + ".sh";
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(shellPath)));
            bw.write(shellStr);
            bw.flush();
            bw.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return shellPath;
    }

    /*public static void main(String[] args) {
        String shellStr = GeneratorShell.runClmShell("e:/spark_test/");

        String shellpath = "bash "+GeneratorShell.writeShell(shellStr,"e:/spark_test/","run_CLM_java");
        System.out.println("============>"+shellpath);
    }*/
}
