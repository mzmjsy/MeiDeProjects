<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%
String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<title>是否自动</title>
		<link type="text/css" rel="stylesheet" href="css/YesOrNoAuto.css"/>
		<style type="text/css">
			
		</style>
	</head>
	<body>
		<center>
			<form action="<%=path%>/gs" method="post">
				<div></div>
				<div>门店BOH-JDE对接自动按钮：
					<input style="font-size:40px;" type="submit" name="yesorno" value="自动">
				</div>
				<div>门店BOH-JDE对接手动动按钮：
					<input type="submit" name="yesorno" value="手动">
				</div>
			</form>
		</center>
	</body>
</html>