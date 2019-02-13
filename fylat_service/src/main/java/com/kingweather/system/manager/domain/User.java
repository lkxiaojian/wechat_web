package com.kingweather.system.manager.domain;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * 用户
 */
public class User
{
	private String id;//ID
	private String userId;//ID
    private String userName;//用户名
    private String password;//密码
    private String userType;//所属：平台用户、租户

    private List<Map<String,Object>> appList;//应用列表
    private String phone;//联系电话
    private String email;//邮箱
    private int status;//用户状态：0:未知，1：正常， 2：冻结   
    private String createTime;//用户创建时间
    private Date loginTime;//用户最后一次登录时间
    private Date logoutTime;//用户最后一次登出时间
    private String parentId;//上级用户
    private String enterprise_id;//企业id,用户创建的应用,对应resource_table表中的id,
    							//    这个表中每个应用有自己的enterprise_id放在parent_id中。平台组会使用应用id处理数据。
    private String sys_type;//天气保险：insure，用户分析：behavior
    private String is_worker; //区别保险公司员工和个人字段:worker,customer

	private String isVip;//是否会员：1：会员；0：非会员
	private String expireDate;//该账号的到期时间：会员账号指其会员到期时间；非会员账号指使用到期时间
    private JsonNode hirePro; //租户信息
    private User parentUser; //父用户

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getSys_type() {
		return sys_type;
	}
	public void setSys_type(String sys_type) {
		this.sys_type = sys_type;
	}
	public List<Map<String, Object>> getAppList() {
		return appList;
	}
	public void setAppList(List<Map<String, Object>> appList) {
		this.appList = appList;
	}
	public JsonNode getHirePro() {
		return hirePro;
	}
	public void setHirePro(JsonNode hirePro) {
		this.hirePro = hirePro;
	}

	public User getParentUser() {
		return parentUser;
	}
	public void setParentUser(User parentUser) {
		this.parentUser = parentUser;
	}
	public String getUserId() {
		return userId;
	}
	public String getEnterprise_id() {
		return enterprise_id;
	}
	public void setEnterprise_id(String enterprise_id) {
		this.enterprise_id = enterprise_id;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}		
	public String getUserType() {
		return userType;
	}
	public void setUserType(String userType) {
		this.userType = userType;
	}

	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}	
	public String getCreateTime() {
		return createTime;
	}
	public void setCreateTime(String createTime) {
		this.createTime = createTime;
	}
	public Date getLoginTime() {
		return loginTime;
	}
	public void setLoginTime(Date loginTime) {
		this.loginTime = loginTime;
	}
	public Date getLogoutTime() {
		return logoutTime;
	}
	public void setLogoutTime(Date logoutTime) {
		this.logoutTime = logoutTime;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getIs_worker() {
		return is_worker;
	}

	public void setIs_worker(String is_worker) {
		this.is_worker = is_worker;
	}

	public String getIsVip() {
		return isVip;
	}

	public String getExpireDate() {
		return expireDate;
	}

	public void setExpireDate(String expireDate) {
		this.expireDate = expireDate;
	}

	public void setIsVip(String isVip) {
		this.isVip = isVip;
	}
}

