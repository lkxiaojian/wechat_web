package com.kingweather.system.manager.domain;

/**
 * 角色
 */
public class Role {
	
	private String roleId;//ID	
	private String roleName;//角色名称	
	private int status;//角色状态：1：启用 2：停用	
	private String roleNote;//角色描述	
	private String userId;//角色创建人
	
	public String getRoleId() {
		return roleId;
	}
	public void setRoleId(String roleId) {
		this.roleId = roleId;
	}
	public String getRoleName() {
		return roleName;
	}
	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}	
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getRoleNote() {
		return roleNote;
	}
	public void setRoleNote(String roleNote) {
		this.roleNote = roleNote;
	}
	public String getUserId() {
		return userId;
	}
	public void setUserId(String userId) {
		this.userId = userId;
	}	
}
