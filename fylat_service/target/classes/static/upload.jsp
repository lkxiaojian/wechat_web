<%@page import="net.sf.json.JSONArray"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta name="_csrf" content="${_csrf.token}" />
<meta name="_csrf_header" content="${_csrf.headerName}" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>插入群组页面</title>
<script src="vendor/jquery/jquery.min.js"></script>
<script>
        $(document).ready(function () {
            $("#iframe").html("todd2");
            $.get("http://localhost:8080/insure-web", function (data) { //初始將a.html include div#iframe
                //$("#iframe2").html(data);
            });
            var htmlobj = $.ajax({url: "http://www.sina.com", dataType: "html", async: false});
            alert(htmlobj);
            $("#iframe2").html(htmlobj);
        });
        //alert("252805232%40qq.com");
        //alert(encodeURIComponent("252805232%40qq.com"));
    </script>
</head>
<body>
	<div id="iframe">
		<!--jquery 插入html 位址-->
	</div>
	<div id="iframe2">
		<!--jquery 插入html 位址-->
	</div>
	<form
		action="tool/upload?qq=252805232%2540qq.com&view=demo2&_csrf=${_csrf.token}"
		method="post" enctype="multipart/form-data">
		<input type="hidden" name="${_csrf.parameterName}"
			value="${_csrf.token}" />
		<table>
			<tr>
				<td>组 名 : <input type="text" name="usergroup_name"
					id="usergroup_name" value="todd" />
				</td>
			</tr>

			<tr>
				<td>选择文件: <input type="file" name="file" />
				</td>
			</tr>


			<tr>
				<td><input type="submit" value="提交" />
					${_csrf.headerName}:${_csrf.parameterName}:${_csrf.token}</td>
			</tr>
		</table>
		<br><%=request.getHeader("X-CSRF-TOKEN")%>
		<br><%=pageContext.getAttribute("_csrf.parameterName")%>
		<br><%=net.sf.json.JSONArray.fromObject(session
        .getAttribute("_csrf"))%>
		<br><%=session.getAttribute("_csrf.parameterName")%>
		<br><%=application.getAttribute("_csrf.parameterName")%>
		<br><%=session.getValue("_csrf.parameterName")%>
		<br><%=request.getHeader("_csrf.parameterName")%>
		<br><%=request.getParameter("_csrf.parameterName")%>
		<br><%=application.getInitParameter("_csrf.parameterName")%>
		<br>
		<%
        String[] se = session.getValueNames();
        for (String s : se) {
            out.println(s + "<br>");
            out.println(session.getAttribute(s) + "<br>");
        }
    %>

		<br><%=org.springframework.security.web.csrf.HttpSessionCsrfTokenRepository.class
        .getName().concat(".CSRF_TOKEN")%>
	</form>
</body>
</html>