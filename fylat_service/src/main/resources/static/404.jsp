<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%
    String path = request.getContextPath();
    session.setAttribute("ctx", path + "/");
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>404</title>
<style type="text/css">
body {
	text-align: center;
	margin: 0 atuto;
}

div {
	position: absolute;
	top: 50%;
	margin-top: -50px;
	left: 50%;
	margin-left: -50px;
}
</style>
</head>
<body>
	<div>
		你访问的页面飞了<img height="50" width="50" src="${ctx}img/cat.gif" />
	</div>
</body>
</html>