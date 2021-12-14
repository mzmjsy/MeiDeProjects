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
      <script src="https://cdn.staticfile.org/vue/2.2.2/vue.min.js"></script>
      <script src="https://unpkg.com/axios/dist/axios.min.js"></script>
	  <style type="text/css">
	    .layui-form {
	        margin-left:50px;
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
                contentType: 'application/json',
                method: 'post',
                cellMinWidth: 80,
                width: 1280,
                cols: [[
                    {field:'transId', width:180, title: '平台运单单号'},
                    {field:'vehicleBrand', width:80, title: '车牌号'},
                    {field:'planDeliveryDate', width:150, title: '计划发货日期', sort: true},
                    {field:'customerName', width:180, title: '客户'},
                    {field:'inceptAddress', title: '收货地址', width: 250},
                    {field:'pmvNum', title: '摞托编号', width: 100},
                    {field:'result', title: '平台返回结果', width: 350}
                ]],
                page: true
              });
            });
        </script>
    </body>
</html>