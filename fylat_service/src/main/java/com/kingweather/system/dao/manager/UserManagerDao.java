package com.kingweather.system.dao.manager;

import com.kingweather.common.util.Page;
import com.kingweather.system.manager.domain.Email;
import com.kingweather.system.manager.domain.User;

import java.util.List;
import java.util.Map;


/**
 * 　用户管理
 */
public interface UserManagerDao
{

	 /**
     * 超级管理员查询平台用户和一级租户
     */
	Page<Map<String, Object>> getAllUsers(Map<String, Object> conditions);
	
	 /**
     * 查询用户
     */
	Page<Map<String, Object>> getAllChildUsers(Map<String, Object> conditions);
	
	 /**
     * 查询指定用户所拥有的角色列表
     */
	List<Map<String, Object>> getRoleByUserId(String userId);
	
	 /**
     * 查询指定用户功能权限列表
     */
	List<Map<String, Object>> getMenuByUserId(String userId, String userType);
	
	 /**
     * 添加用户
     */
    boolean addUser(User user);
    
    /**
     * 添加权限
     */
    boolean addUserMenu(String userId, String[] menuIds);
    
    /**
     * 删除用户的子用户功能授权中取消的功能项
     */
    boolean delSubUMCanceledMids(String userId, String[] menuIdStrs);
    
    /**
     * 删除用户的子用户授权的角色中取消的功能项
     */
    boolean delSubRMCanceledMids(String userId, String[] menuIdStrs);
    
    /**
     * 删除用户功能授权中  该用户角色已经有的功能授权
     */
    boolean deleteUMByUserIdRoleIds(String userId, String[] roleIdStrs);
    
    /**
     * 添加角色
     */
    boolean addUserRole(String userId, String[] roleIds);

    /**
     * 编辑用户
     */
    boolean editUser(User user);
    
    /**
     * 变更状态
     */
    boolean updateStatus(String userId, int status);
    
    /**
     * 查询指定userId的子用户
     */
    List<Map<String,Object>> getChildUserByUserId(String userId);
    
    /**
     * 根据userID删除用户
     */
    boolean deleteUser(String[] userIds);

    /**
     * 根据user_type删除用户
     */
    boolean deleteUserByType(String userType);

    /**
     * 删除用户权限
     */
    boolean deleteUserMenu(String[] userIds);
    
    /**
     * 删除用户角色
     */
    boolean deleteUserRole(String[] userIds);
    
    /**
     * 用户名、密码查询用户
     */
    User getUserByNamePassword(String userName, String password);
    
    /**
     * 获取当前用户的所有应用列表
     */
    List<Map<String,Object>> getUserApps(String entId);
    
    /**
     * 获取当前用户拥有的所有菜单项
     */
    List<Map<String,Object>> getMenuTreeByUserId(String userId);
    
    /**
     * 用户更改密码
     */
    int updatePassword(String userName, String password, String newpassword);
    
    /**
     * 获取指定用户类型用户的所有权限
     */
    List<Map<String,Object>> getMenuTreeByUidAndUtp(String userId, String userType);
    /**
     * 注册用户检查用户名
     */
	User getUserByName(String userName);
	/**
	 * 注册租户
	 */
	boolean regist(Map<String, Object> map);
	/**
	 * 查找是否有重复的域名
	 * @param domain
	 * @return
	 */
	Boolean getdomain(String domain);
    /**
     * 邮件服务
     */
    String readEmail(String email);

    Integer addEmailConfig(Email email);

    Integer delEmail();

    List<Map<String, Object>> getEmailConfig();

    Integer resetpw(String email, String newpw);

    /**
     * 查询所有admin账号的名称及所属的公司名称信息,在super和@kingweather创建其他公司账号时使用
     */
    Page<Map<String, Object>> getAllAdminAndGroup(Map<String, Object> conditions);

}