package com.kingweather.system.manager.domain;

public class Menu {

	private String menuId;//ID
	private String parentId;//父级菜单ID
	private String menuName;//菜单名称
	private String actionUrl;//菜单url
	private int menuSort;//同一级菜单排序
	private int status;//菜单状态  1:启用 2：停用
    private String imgFlag;//图标标识
    private int subnodeFlag;//是否是子叶节点 1：是  2：否
	private String userGroupSuffix;//公司后缀
	
	public String getMenuId() {
		return menuId;
	}
	public void setMenuId(String menuId) {
		this.menuId = menuId;
	}
	public String getParentId() {
		return parentId;
	}
	public void setParentId(String parentId) {
		this.parentId = parentId;
	}
	public String getMenuName() {
		return menuName;
	}
	public void setMenuName(String menuName) {
		this.menuName = menuName;
	}
	public String getActionUrl() {
		return actionUrl;
	}
	public void setActionUrl(String actionUrl) {
		this.actionUrl = actionUrl;
	}
	public int getMenuSort() {
		return menuSort;
	}
	public void setMenuSort(int menuSort) {
		this.menuSort = menuSort;
	}
	public int getStatus() {
		return status;
	}
	public void setStatus(int status) {
		this.status = status;
	}
	public String getImgFlag() {
		return imgFlag;
	}
	public void setImgFlag(String imgFlag) {
		this.imgFlag = imgFlag;
	}
	public int getSubnodeFlag() {
		return subnodeFlag;
	}
	public void setSubnodeFlag(int subnodeFlag) {
		this.subnodeFlag = subnodeFlag;
	}
	public String getUserGroupSuffix() {
		return userGroupSuffix;
	}

	public void setUserGroupSuffix(String userGroupSuffix) {
		this.userGroupSuffix = userGroupSuffix;
	}
}
