<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta name="_csrf" content="${_csrf.token}" />
<meta name="_csrf_header" content="${_csrf.headerName}" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>插入群组页面</title>
</head>
<body>
	<form action="marketing/addInsidesale" method="post">
		<input type="hidden" name="${_csrf.parameterName}"
			value="${_csrf.token}" /> <input type="hidden" name="insidesale_id"
			id="insidesale_id" value="4777" />
		<table>
			<tr>
				<td>组 名 : <input type="text" name="insidesale_name"
					id="insidesale_name" /></td>
			</tr>

			<tr>
				<td>表达式: <input type="text" name="insidesale_url"
					id="insidesale_url" /></td>
			</tr>

			<tr>
				<td>备 注 ：<textarea cols="22" name="note" id="note"></textarea></td>
			</tr>

			<tr>
				<td><input type="submit" value="提交" /></td>
			</tr>
		</table>
	</form>
</body>
</html>