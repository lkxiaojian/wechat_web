package com.kingweather.system.service.manager;

import com.kingweather.common.constants.SystemConstants;
import com.kingweather.system.manager.domain.Email;
import com.kingweather.system.manager.domain.User;

import java.util.List;
import java.util.Map;





/**
 * 用户管理
 */
public interface UserManagerService extends SystemConstants
{
  
	/**
     * 查询平台用户和一级租户
     */
	Map<String, Object> getAllUsers(Object... object);
	
	 /**
     * 查询用户
     */
	Map<String, Object> getAllChildUsers(Object... object);
	
	/**
     * 查询指定用户所拥有的角色列表
     */
	Map<String, Object> getRoleByUserId(String userId);
	
	/**
     * 查询指定用户功能授权列表
     */
	Map<String, Object> getMenuByUserId(String userId, String userType);
	
	/**
     * 查询指定用户类型功能树
     */
	Map<String, Object> getMenuTreeByUidAndUtp(String userId, String userType);
	
	 /**
     * 添加用户
     */
    boolean addUser(User user);
    
    /**
     * 添加权限
     */
    boolean addUserMenu(String userId, String menuIds);
    
    /**
     * 删除子用户权限、角色权限中父用户取消的权限
     */
    boolean delCanceledURMidByUserId(String userId, String uncheckMids, String groupId);
    
    /**
     * 添加角色
     */
    boolean addUserRole(String userId, String roleIds);
    
    /**
     * 查询当前用户下取消的menuids
     */
    public List<String> getCanceledMidsByUserId(String userId, String groupId);

    /**
     * 编辑用户
     */
    boolean editUser(User user); 
    
    /**
     * 变更状态
     */
    boolean updateStatus(String userId, int status);
    
    /**
     * 删除用户角色
     */
    boolean deleteUserRole(String userId);
    
    /**
     * 批量删除用户
     */
    Map<String, Object> deleteUser(String userId);

    /**
     * 根据userType删除用户
     */
    boolean deleteUserByType(String userType);

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
    Map<String,Object> getMenuTreeByUserId(String userId);
    
    /**
     * 用户更改密码
     */
    int updatePassword(String userName, String password, String newpassword);
    
    /**
     * 注册用户检查用户名
     */
	User getUserByName(String userName);
	
	/**
	 * 注册用户
	 */
	boolean regist(Map<String, Object> map);
	/**
	 * 查找是否有重复的域名
	 * @param domain
	 * @return
	 */
	Boolean finddomain(String domain);

    /**
     * 读取用户邮件信息
     *
     * @return
     */
    //得到邮件服务信息
    Email gEmailconfig();

    String readEmail(String email);

    Integer delEmail();

    Integer addEmailConfig(Email email);

    Integer resetpw(String email, String newpw);

    /**
     *查询所有admin账号的名称及所属的公司名称信息,在super和@kingweather创建其他公司账号时使用
     */
    Map<String, Object> getAllAdminAndGroup(Object... obj);

}
