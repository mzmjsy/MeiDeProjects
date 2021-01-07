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
		<title>总部数据生成XML</title>
	    <link rel="stylesheet" type="text/css" href="<%=path%>/css/easyui.css"/>
		<link rel="stylesheet" type="text/css" href="<%=path%>/css/icon.css"/>
		<link type="text/css" rel="stylesheet" href="<%=path%>/css/widget/lib.ui.button.css"/>
		<link type="text/css" rel="stylesheet" href="<%=path%>/css/widget/lib.ui.toolbar.css"/>
		<link type="text/css" rel="stylesheet" href="<%=path%>/css/widget/lib.ui.window.css"/>
		<link type="text/css" rel="stylesheet" href="<%=path %>/css/lib.ui.form.css"/>
		<link rel="stylesheet" type="text/css" href="<%=path %>/css/alertyle.css" />
		<style type="text/css">
			*{padding: 0; margin: 0}  
	        .box{  
	            position: fixed;  
	            width: 100%;  
	            height: 100%;  
	            background: rgba(0,0,0,0.2);  
	            display: none;  
	        }  
	        .box1{  
	            width: 300px;  
	            height: 200px;  
	            position: fixed;left: 50%; top: 25%;  
	            margin-left: -180px;  
	            border: 1px solid #000000; 
	        }
	        #wait2 { 
				filter:alpha(opacity=80);
				-moz-opacity:0.8;
				-khtml-opacity: 0.8;
				opacity: 0.8;
				background-color:black;
				width:100%;
				height:100%;
				position:absolute;
				z-index:998;
				top:0px;
				left:0px;
			}			
			#wait { 
				position:absolute; 
				top:50%; 
				left:50%; 
				margin-left:-80px; 
				margin-top:-30px; 
				z-index:999;
			}
		</style>
	</head>

	<body>
	  	<form id="listForm" name="listForm" action="store/listStore.do" method="post">
			<div class="date" style="margin-top:30px;">
				<h4 style="float: left;margin-left:50px;width:250px;">	
					<span style="color:red;margin-right:5px;">*</span>
					<span style="color:black;margin-right:5px;">开始日期</span>
					<input type="date" id="bdat" name="bdat" style="width:130px;"/>
				</h4>
				<h4 style="float: left;margin-left:20px;">
					<span style="color:red;margin-right:5px;">*</span>
					<span style="color:black;margin-right:5px;">结束日期</span>
					<input type="date" id="edat" name="edat" style="width:130px;"/>
				</h4>
				<h4 style="float: left;margin-left:40px;">
					<span style="color:red;margin-right:5px;">*</span>
					<span style="color:black;margin-right:5px;">门店</span>
					<input type="text" id="vscode" name="vscode" readonly="readonly" style="width:150px;height:25px;"/>
					<img id="searchStore" class="search" src="<%=path%>/image/searchmul1.png" style="margin-top: 0px;"  />
				</h4>
				<h4 style="float: left;margin-left:40px;">
					<input type="button" id="sub" value="提交" style="width:100px;height:25px;cursor: pointer;border-radius:5px;"/>
				</h4>
			</div>
		</form>
    	<div id="wait2" style="visibility: hidden;"></div>
    	<div id="wait" style="visibility: hidden;">
			<img id="loading" src="<%=path%>/image/loading_detail.png" />&nbsp;
			<span style="color:white;font-size:15px;vertical-align: middle;">请等待...</span>
		</div>
	    <div class="md-modal md-effect-8" id="modal-8" >
			<div class="tishibg">
				<div class="md-content">
					<h2>提示</h2>
					<div>
						<ul>
							<li></li>
						</ul>
						<button class="md-close" style="padding: 10px 35px 10px 35px;border:0px;">关闭</button>
					</div>
				</div>
			</div>
			<button class="md-trigger" id="btn" data-modal="modal-8" style="display:none"></button>
		</div>
		<script>
			var polyfilter_scriptpath = '/js/';
		</script>
		<script type="text/javascript" src="<%=path%>/js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="<%=path%>/js/teleFunc.js"></script>
	 	<script type="text/javascript" src="<%=path%>/js/widget/lib.ui.button.js"></script>
	 	<script type="text/javascript" src="<%=path%>/js/datePicker/WdatePicker.js"></script>
	 	<script type="text/javascript" src="<%=path%>/js/widget/lib.ui.window.js"></script>
	 	<script type="text/javascript" src="<%=path%>/js/widget/lib.ui.drag.js"></script>
	 	<script type="text/javascript" src="<%=path%>/js/lib.ui.core.js"></script>
	 	<script type="text/javascript" src="<%=path%>/js/widget/lib.ui.toolbar.js"></script>
	 	<script type="text/javascript" src="<%=path%>/js/popwin.js"></script>
		<script type="text/javascript" src="<%=path%>/js/alertTishi.js"></script>
		<script type="text/javascript">
			//为开始日期设置最大值，为结束日期
			$("#bdat").click(function(){
				$("#bdat").prop("max",$("#edat").val());
			});

			//为结束日期设置最小值，为开始日期
			$("#edat").click(function(){
				$("#edat").prop("min",$("#bdat").val());
			});

			//打开选择门店页面
			$("#searchStore").click(function(){
				var vscode = $("#vscode").val();
				popWin.showWin("store/toChooseStore.do", 700, 500); 
			});

			//接收门店页面选择的门店，并赋值到门店
			function setStore(vscodes) {
				$("#vscode").val("");
				$("#vscode").val(vscodes);
			}

			//提交按钮执行
			$("#sub").click(function(){
				var data = {};
				var str = "";
				var bdat = $("#bdat").val();
				var edat = $("#edat").val();
				var vscode = $("#vscode").val();

				if ("" == bdat) {
					$('.md-content').find('ul').find('li').text("开始日期不可为空！");
	            	$("#btn").click();
				} else if ("" == edat) {
					$('.md-content').find('ul').find('li').text("结束日期不可为空！");
	            	$("#btn").click();
				} else if ("" == vscode) {
					$('.md-content').find('ul').find('li').text("门店不可为空！");
	            	$("#btn").click();
				} else {
					data["bdat"] = bdat;
					data["edat"] = edat;
					data["vscode"] = vscode;
					$('#wait2').css("visibility","visible");
					$('#wait').css("visibility","visible");
					
					$.ajax({
						type : 'POST',
						data : data,
						url : '<%=path%>/store/listStore.do',
						success : function(message) {
							var str = message.split(";");
							$("#bdat").val(str[0]);
							$("#edat").val(str[1]);
							$("#vscode").val(str[2]);
							
							$('.md-content').find('ul').find('li').text(eval("'" + str[3] + "'"));
			            	$("#btn").click();
							$('#wait2').css("visibility","hidden");
							$('#wait').css("visibility","hidden");
						},
						error:function(e){
							$('#wait2',parent.document).css("visibility","hidden");
							$('#wait',parent.document).css("visibility","hidden");
							$('.md-content').find('ul').find('li').text(message);
			            	$("#btn").click();
						}
					});
				}
			});
		</script>
	</body>
</html>