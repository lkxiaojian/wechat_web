package com.kingweather.common.util;

import com.kingweather.system.manager.domain.Email;
import org.springframework.mail.javamail.JavaMailSenderImpl;
import org.springframework.mail.javamail.MimeMessageHelper;

import javax.mail.internet.MimeMessage;
import java.util.Date;
import java.util.Map;
import java.util.Properties;


public class EmailUtils {
	private static JavaMailSenderImpl senderImpl = new JavaMailSenderImpl();
	public static Email staticEmail = new Email("smtp.kingweather.cn","service@kingweather.cn","kwPwd@1234");

	public static boolean testConnect(Email email){
		try {
		    senderImpl.setHost(email.getSmtpServer());
		    MimeMessage mailMessage = senderImpl.createMimeMessage();
		    MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true, "utf-8");
		             
		    messageHelper.setTo(email.getEmailName());
		    messageHelper.setFrom(email.getEmailName());
		    messageHelper.setSubject("测试邮件！");
		    messageHelper.setText("<html><head></head><body><h1>成功牵手！！！</h1></body></html>",true); 
		    
		    senderImpl.setUsername(email.getEmailName()); 
		    senderImpl.setPassword(email.getPassword()); 
		    Properties prop = new Properties();
		        prop.put("mail.smtp.auth", "true");
		        prop.put("mail.smtp.timeout", "25000"); 
		    senderImpl.setJavaMailProperties(prop);
		    senderImpl.send(mailMessage);
		    System.out.println("发送成功");
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	/**
	 * 重置密码
	 * @param email
	 * @param toemile
	 * @param resetpwd
	 * @return
	 */
	public static boolean confirm(Email email,String toemile,String resetpwd){
		String content ="<table cellpadding='0' cellspacing='0' bgcolor='' width='100%' style='background:#ffffff;'>"+
				"<tbody>"+
				"	<tr>"+
				"		<td>"+
				"		<table cellpadding='0' cellspacing='0' width='100%'>"+
				"        <tbody>"+
				"		<tr>"+
				"			<td width='25px;' style='width:25px;'></td>"+
				"			<td align=''>"+
				"				<div style='line-height:40px;height:40px;'></div>"+
				"				<p style='margin:0px;padding:0px;'><strong style='font-size:14px;line-height:24px;color:#333333;font-family:arial,sans-serif;'>"+
				"				亲爱的用户：</strong></p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>您好！</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"					您于 "+DateUtil.formatDateTime(new Date(), "yyyy年 MM月dd日 HH:mm")+" 重置密码 ，点击以下链接，即可激活新密码：</p>"+
				"				<p style='margin:0px;padding:0px;font-size:12px;'><a href='"+resetpwd+"' target='_blank'>"+resetpwd+"</a></p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#979797;font-family:arial,sans-serif;'>"+
				"					(如果您无法点击此链接，请将它复制到浏览器地址栏后访问)</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"				1、为了保障您帐号的安全性，请在 48小时内完成激活！</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"				2、请尽快完成激活，否则过期失效。</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif; text-align:center;'> "+DateUtil.formatDateTime(new Date(), "yyyy年 MM月dd日")+"</p>"+
				"			</td>"+
				"		</tr>"+
				"		</tbody>"+
				"		</table>"+
				"		</td>"+
				"	</tr>"+
				"</tbody>"+
				"</table>";
		try {
		    senderImpl.setHost(email.getSmtpServer());
		    MimeMessage mailMessage = senderImpl.createMimeMessage();
		    MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true, "utf-8");
		             
		    messageHelper.setTo(toemile);
		    messageHelper.setFrom(email.getEmailName());
		    messageHelper.setSubject("密码修改验证！");
		    messageHelper.setText("<html><head></head><body>"+content+"</body></html>",true); 
		    
		    senderImpl.setUsername(email.getEmailName()); 
		    senderImpl.setPassword(email.getPassword()); 
		    Properties prop = new Properties();
		        prop.put("mail.smtp.auth", "true");
		        prop.put("mail.smtp.timeout", "25000"); 
		    senderImpl.setJavaMailProperties(prop);
		    senderImpl.send(mailMessage);
		    System.out.println("发送成功");
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	/**
	 * 开通帐户
	 * @param email
	 * @param toemile
	 * @return
	 */
	public static boolean openAccount(Email email,String toemile,String facade){
		String content ="<table cellpadding='0' cellspacing='0' bgcolor='' width='100%' style='background:#ffffff;'>"+
				"<tbody>"+
				"	<tr>"+
				"		<td>"+
				"		<table cellpadding='0' cellspacing='0' width='100%'>"+
				"        <tbody>"+
				"		<tr>"+
				"			<td width='25px;' style='width:25px;'></td>"+
				"			<td align=''>"+
				"				<div style='line-height:40px;height:40px;'></div>"+
				"				<p style='margin:0px;padding:0px;'><strong style='font-size:14px;line-height:24px;color:#333333;font-family:arial,sans-serif;'>"+
				"				亲爱的用户：</strong></p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>您好！</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"					您于 "+DateUtil.formatDateTime(new Date(), "yyyy年 MM月dd日 HH:mm")+" 帐户已开通，点击下面链接可以进入登入页面。</p>"+
				"				<p style='margin:0px;padding:0px;font-size:12px;'><a href='"+facade+"' target='_blank'>"+facade+"</a></p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#979797;font-family:arial,sans-serif;'>"+
				"					(如果您无法点击此链接，请将它复制到浏览器地址栏后访问)</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"				此致</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"				坤舆天气团队敬上</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif; text-align:center;'> "+DateUtil.formatDateTime(new Date(), "yyyy年 MM月dd日")+"</p>"+
				"			</td>"+
				"		</tr>"+
				"		</tbody>"+
				"		</table>"+
				"		</td>"+
				"	</tr>"+
				"</tbody>"+
				"</table>";
		return emailUtil(email,"帐户开通",toemile,content);
	}

	/**
	 * 开通帐户
	 * @param email
	 * @return
	 */
	public static boolean orderDownloadTime(Email email,Map<String,Object> detail){
		String content ="<table cellpadding='0' cellspacing='0' bgcolor='' width='100%' style='background:#ffffff;'>"+
				"<tbody>"+
				"	<tr>"+
				"		<td>"+
				"		<table cellpadding='0' cellspacing='0' width='100%'>"+
				"        <tbody>"+
				"		<tr>"+
				"			<td width='25px;' style='width:25px;'></td>"+
				"			<td align=''>"+
				"				<div style='line-height:40px;height:40px;'></div>"+
				"				<p style='margin:0px;padding:0px;'><strong style='font-size:14px;line-height:24px;color:#333333;font-family:arial,sans-serif;'>"+
				"				亲爱的用户：</strong></p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>您好！</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"					您申请的订单数据，"+detail.get("datatimestart")+"到"+detail.get("datatimeend")+' '+detail.get("datatype")+"数据"+detail.get("content")+" </p>"+
				"				<p style='margin:0px;padding:0px;font-size:12px;'><a href='"+detail.get("facade")+"' target='_blank'>"+detail.get("facade")+"</a></p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#979797;font-family:arial,sans-serif;'>"+
				"					(如果您无法点击此链接，请将它复制到浏览器地址栏后访问)</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"				此致</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"				坤舆天气团队敬上</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif; text-align:center;'> "+DateUtil.formatDateTime(new Date(), "yyyy年 MM月dd日")+"</p>"+
				"			</td>"+
				"		</tr>"+
				"		</tbody>"+
				"		</table>"+
				"		</td>"+
				"	</tr>"+
				"</tbody>"+
				"</table>";
		return emailUtil(email, detail.get("subject").toString(), detail.get("toemile").toString(), content);
	}

	/**
	 * 数据分析大于3年申请审批
	 * @param email
	 * @return
	 */
	public static boolean dataAnalysisApprove(Email email,Map<String,Object> detail){
		String content ="<table cellpadding='0' cellspacing='0' bgcolor='' width='100%' style='background:#ffffff;'>"+
				"<tbody>"+
				"	<tr>"+
				"		<td>"+
				"		<table cellpadding='0' cellspacing='0' width='100%'>"+
				"        <tbody>"+
				"		<tr>"+
				"			<td width='25px;' style='width:25px;'></td>"+
				"			<td align=''>"+
				"				<div style='line-height:40px;height:40px;'></div>"+
				"				<p style='margin:0px;padding:0px;'><strong style='font-size:14px;line-height:24px;color:#333333;font-family:arial,sans-serif;'>"+
				"				亲爱的用户：</strong></p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>您好！</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"					您申请的投保区域为："+detail.get("region")+"，投保品种为："+' '+detail.get("crop")+"，投保面积为："+detail.get("area")+"的数据，"+detail.get("content")+" </p>"+
				"				<p style='margin:0px;padding:0px;font-size:12px;'><a href='"+detail.get("facade")+"' target='_blank'>"+detail.get("facade")+"</a></p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#979797;font-family:arial,sans-serif;'>"+
				"					(如果您无法点击此链接，请将它复制到浏览器地址栏后访问)</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"				此致</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif;'>"+
				"				坤舆天气团队敬上</p>"+
				"				<p style='margin:0px;padding:0px;line-height:24px;font-size:12px;color:#333333;font-family:\'宋体\',arial,sans-serif; text-align:center;'> "+DateUtil.formatDateTime(new Date(), "yyyy年 MM月dd日")+"</p>"+
				"			</td>"+
				"		</tr>"+
				"		</tbody>"+
				"		</table>"+
				"		</td>"+
				"	</tr>"+
				"</tbody>"+
				"</table>";
		return emailUtil(email, detail.get("subject").toString(), detail.get("to_email").toString(), content);
	}
	public static boolean emailUtil(Email email,String subject,String toemile,String content){
		try {
		    senderImpl.setHost(email.getSmtpServer());
		    MimeMessage mailMessage = senderImpl.createMimeMessage();
		    MimeMessageHelper messageHelper = new MimeMessageHelper(mailMessage, true, "utf-8");
		             
		    messageHelper.setTo(toemile);
		    messageHelper.setFrom(email.getEmailName());
		    messageHelper.setSubject(subject);
		    messageHelper.setText("<html><head></head><body>"+content+"</body></html>",true); 
		    
		    senderImpl.setUsername(email.getEmailName()); 
		    senderImpl.setPassword(email.getPassword()); 
		    Properties prop = new Properties();
		        prop.put("mail.smtp.auth", "true");
		        prop.put("mail.smtp.timeout", "25000"); 
		    senderImpl.setJavaMailProperties(prop);
		    senderImpl.send(mailMessage);
		    System.out.println("发送成功");
		} catch (Exception e) {
			e.printStackTrace();
			return false;
		}
		return true;
	}
	/*public static void main(String[] args) {
		Email e = new Email();
		e.setSmtpServer("smtp.kingweather.cn");
		e.setEmailName("service@kingweather.cn");
		e.setPassword("kwPwd@1234");//Kingweather12332
		EmailUtils.emailUtil(e, "test", "luyllyl@163.com", "1111111");
		
	}*/
}
