package com.kingweather.system.manager.domain;

/**
 * 邮件
 */
public class Email{
    private Integer id;
    private String configType;
    private Integer configId;
    private String serverDomain;
    private String smtpServer;
    private Integer smtpPort;
    private String emailName;
    private String userName;
    private String password;
    private Integer tls_enable; // 默认状态为：不开启－》0，开启：－》1
    private Integer ssl_enable; // 默认状态为：不开启－》0 ，开启：－》1
	private String propery;

	public Email(){}
    public Email(String smtpServer,String emailName,String password){
        this.smtpServer = smtpServer;
        this.emailName = emailName;
        this.password = password;
    }
    public String getServerDomain() {
		return serverDomain;
	}

	public void setServerDomain(String serverDomain) {
		this.serverDomain = serverDomain;
	}

    public String getPropery()
    {
        return propery;
    }

    public void setPropery(String propery)
    {
        this.propery = propery;
    }

    public Integer getId()
    {
        return id;
    }

    public void setId(Integer id)
    {
        this.id = id;
    }

    public String getConfigType()
    {
        return configType;
    }

    public void setConfigType(String configType)
    {
        this.configType = configType;
    }

    public Integer getConfigId()
    {
        return configId;
    }

    public void setConfigId(Integer configId)
    {
        this.configId = configId;
    }

    public String getSmtpServer()
    {
        return smtpServer;
    }

    public void setSmtpServer(String smtpServer)
    {
        this.smtpServer = smtpServer;
    }

  

    public Integer getSmtpPort() {
		return smtpPort;
	}

	public void setSmtpPort(Integer smtpPort) {
		this.smtpPort = smtpPort;
	}

	public String getEmailName() {
        return emailName;
    }

    public void setEmailName(String emailName)
    {
        this.emailName = emailName;
    }

    public String getUserName()
    {
        return userName;
    }

    public void setUserName(String userName)
    {
        this.userName = userName;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(String password)
    {
        this.password = password;
    }

    public Integer getTls_enable()
    {
        return tls_enable;
    }

    public void setTls_enable(Integer tls_enable)
    {
        this.tls_enable = tls_enable;
    }

    public Integer getSsl_enable()
    {
        return ssl_enable;
    }

    public void setSsl_enable(Integer ssl_enable)
    {
        this.ssl_enable = ssl_enable;
    }
}
