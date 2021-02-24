<%
String path = request.getContextPath();
%>
<%@ page language="java" import="java.util.*" contentType="text/html; charset=UTF-8" %>
<!DOCTYPE html>
<html>
    <head>
      <meta charset="utf-8">
      <title>日志查询</title>
      <meta name="renderer" content="webkit">
      <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <link rel="stylesheet" href="<%=path%>/layui/css/layui.css"  media="all">
	  <style type="text/css">
	    #test {
	        text-align: center;
	    }
	  </style>
    </head>
    <body>
        <table class="layui-hide" id="test"></table>
        <script src="<%=path%>/layui/layui.js" charset="utf-8"></script>
        <script>
            layui.use('table', function(){
              var table = layui.table;
              table.render({
                elem: '#test',
                url:'<%=path%>/dstDelivery/listContent.do',
                method: 'post',
                cellMinWidth: 80,
                width: 1000,
                cols: [[
                    {field:'TRANS_ID', width:150, title: '平台运单单号'},
                    {field:'VEHICLE_BRAND', width:80, title: '车牌号'},
                    {field:'PLAN_DELIVERY_DATE', width:150, title: '计划发货日期', sort: true},
                    {field:'CUSTOMER_NAME', width:180, title: '客户'},
                    {field:'INCEPT_ADDRESS', title: '收货地址', width: 180},
                    {field:'PMV_NUM', title: '摞托编号', width: 100},
                    {field:'VRESULT', title: '平台返回结果', width: 180}
                ]],
                page: true
              });
            });
        </script>
    </body>
</html>