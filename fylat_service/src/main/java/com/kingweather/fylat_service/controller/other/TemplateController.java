package com.kingweather.fylat_service.controller;


import com.kingweather.common.component.ssh.SSHCommandExecutor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.servlet.ModelAndView;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;


@RestController
public class TemplateController {
    @Resource
    private SSHCommandExecutor sshCommandExecutor;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/weather_service")
    public String hello() {
        sshCommandExecutor.execute("bash /data/tool/bashShell/for2.sh","/topic/super/sendClient");
        return "index";
    }
    @GetMapping("/hello1")
    public ModelAndView hello1() {
        ModelAndView mv = new ModelAndView("hello");
        return mv;
    }

    @GetMapping("/hello2")
    public String hello2(Map<String, Object> map) {
        map.put("name","luyllyl");
        return "hello";
    }
    @GetMapping("/helloFtl")
    public String helloFtl(){

        return "helloFtl";
    }

    @GetMapping("/helloFtl2")
    public String helloFtl2(Map<String,Object> map){
        map.put("name","luyllyl");
        return "helloFtl";
    }
}
