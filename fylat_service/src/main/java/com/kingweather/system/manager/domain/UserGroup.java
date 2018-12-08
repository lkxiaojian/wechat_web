package com.kingweather.system.manager.domain;

/**
 * 用户组
 */
public class UserGroup
{
	private String groupId;
    private String groupName;  
    private String groupCode;//用户类型   systemConstants
    private String note;
    
	public String getGroupId() {
		return groupId;
	}
	public void setGroupId(String groupId) {
		this.groupId = groupId;
	}	    
	public String getGroupCode() {
		return groupCode;
	}
	public void setGroupCode(String groupCode) {
		this.groupCode = groupCode;
	}
	public String getGroupName() {
		return groupName;
	}
	public void setGroupName(String groupName) {
		this.groupName = groupName;
	}
	public String getNote() {
		return note;
	}
	public void setNote(String note) {
		this.note = note;
	}
    
    
}

