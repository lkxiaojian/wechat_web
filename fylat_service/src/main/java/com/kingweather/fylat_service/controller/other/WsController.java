package com.kingweather.fylat_service.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.util.StringUtils;

import javax.annotation.Resource;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by luyl on 2017/12/19.
 */
@Controller
public class WsController {
    //@MessageMapping注解和我们之前使用的@RequestMapping类似
    //@SendTo注解表示java是生产者，会对订阅了@SendTo中路径的js发信息
    @MessageMapping("/welcome")
    @SendTo("/topic/getResponse")
    public Map<String,Object> helloWS(Map<String,Object> message) {
        System.out.println(message.get("name"));
        Map<String,Object> ret = new HashMap<>();
        ret.put("result","welcome," + message.get("name") + " !");
        return ret;
    }

    @Resource
    private SimpMessagingTemplate messagingTemplate;

    public void sendClient(Map<String,Object> message) {
        System.out.println(message.get("name"));
        Map<String,Object> ret = new HashMap<>();
        ret.put("result","welcome," + message.get("name") + " !");
        if(StringUtils.isEmpty(message.get("user"))){
            messagingTemplate.convertAndSend("/topic/sendClient",ret);//1对多发信息
        }else {
            //1对1发送
            //messagingTemplate.convertAndSendToUser(message.get("user").toString(),"/topic/sendClient",ret);
            messagingTemplate.convertAndSend("/topic/"+message.get("user").toString()+"/sendClient",ret);
        }
    }

/*    @MessageMapping("/chat")
    public Map<String,Object> charWS(Map<String,Object> message) {
        System.out.println(message.get("name"));
        Map<String,Object> ret = new HashMap<>();
        ret.put("result"," connect chat begin !");
        messagingTemplate.convertAndSendToUser(message.get("user").toString(),"/topic/chat",ret);
        return ret;
    }*/



}
