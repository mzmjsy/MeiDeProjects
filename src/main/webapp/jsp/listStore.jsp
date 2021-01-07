<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
String path = request.getContextPath();
%>
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>Insert title here</title>
	<link rel="stylesheet" type="text/css" href="<%=path %>/css/input_text.css">
</head>
<body>
	<div style="margin-left:10px;">
		<form id="storeForm" action="<%=path %>/store/toChooseStore.do">
			<h4 style="float:left;margin-left:30px;">门店编码<input type="text" class="text" id="vscode" name="vscode" value="${vscode }" ></h4>
			<h4 style="float:left;margin-left:20px;">门店名称<input type="text" class="text" id="vsname" name="vsname" value="${vsname }" ></h4>
			<h4 style="float:left;margin-left:20px;"><input type="submit" class="texts" value="查询" style="height:25px;width:70px;cursor: pointer;"></h4>
			<h4 style="float:left;margin-left:20px;"><input type="button" class="texts" id="enter" value="确定" style="height:25px;width:70px;cursor: pointer;"></h4>
			<h4 style="float:left;margin-top:-10px;margin-left:30px;width:600px;">
				选中门店<input type="text" class="text" id="vcode" name="vcode" value="${vcode }" style="width:403px;" />
				<input type="reset" class="texts" value="取消" style="height:25px;width:70px;margin-left:12px;cursor: pointer;">
			</h4>
		</form>
		<table class="altrowstable" id="alternatecolor" style="height:10px;">
			<tr>
				<th style="width:25px;">序号</th>
				<th style="width:20px;"><input type="checkbox" id="chkAll" ></th>
				<th style="width:80px;">门店编码</th>
				<th style="width:120px;">门店名称</th>
				<th style="width:80px;">城市名称</th>
				<th style="width:80px;">市场名称</th>
			</tr>
			<c:forEach var="store" items="${listStore }" varStatus="status">
				<tr>
					<td>${status.index + 1 }</td>
					<td><input type="checkbox" value="${store.vscode }" name="idList" <c:if test="${map[store.vscode] == 1}">checked=checked</c:if> onclick="setStoreCode('${store.vscode }')" style="margin-left:15px;"></td>
					<td>${store.vscode }</td>
					<td>${store.vsname }</td>
					<td>${store.cityname }</td>
					<td>${store.marketname }</td>
				</tr>
			</c:forEach>
		</table>
	</div>
	<script type="text/javascript" src="<%=path%>/js/jquery-1.7.1.js"></script>
	<script type="text/javascript">
		$("#chkAll").click(function(){
		    var checked_status = this.checked;
		    $("input[name=idList]").each(function(){
		        this.checked = checked_status;
		    });
		});

		$("#enter").click(function(){
			parent['setStore']($("#vcode").val());
			$("#popWinClose",parent.document).click();
		});

		//点击复选框，将改店编码放入选中门店框中
		function setStoreCode(vscode){
			var vcode = "" == $("#vcode").val() ? $("#vcode").val() : $("#vcode").val() + ",";

			if ($("#vcode").val().indexOf(vscode) < 0) {
				$("#vcode").val(vcode + vscode)
			}
		}
	</script>
</body>
</html>