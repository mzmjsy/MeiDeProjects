<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="fmt" uri="http://java.sun.com/jsp/jstl/fmt"%>
<%
String path = request.getContextPath();
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
	<head>
		<title><fmt:message key="store" /><fmt:message key="select1" /></title>
			<link type="text/css" rel="stylesheet" href="<%=path%>/css/lib.ui.core.css"/>
			<link type="text/css" rel="stylesheet" href="<%=path%>/css/widget/lib.ui.button.css"/>
			<link type="text/css" rel="stylesheet" href="<%=path%>/css/widget/lib.ui.toolbar.css"/>
			<link type="text/css" rel="stylesheet" href="<%=path%>/css/widget/lib.ui.window.css"/>
			<link type="text/css" rel="stylesheet" href="<%=path%>/css/widget/lib.ui.grid.css"/>
			<link type="text/css" rel="stylesheet" href="<%=path %>/css/lib.ui.form.css"/>
			<style type="text/css">
				.grid td span{
					padding:0px;
				}
				.form-line .form-input{
					width: 17%;
					margin-right:0px;
 					padding-left: 0px;
				}
				.form-line .form-input input,.form-line .form-input select{
					width:90%;
				}
			</style>
		</head>
	<body>
		<div id='toolbar'></div>
		<form id="queryForm" name="queryForm" method="post" action="<%=path %>/store/toChooseStore.do">
			<div class="form-line">
				<div class="form-label" style="width:35px">市场</div>
				<div class="form-input" style="width:105px" >
					<select id="marketcode" name="marketcode" class="select" >
						<option value="">全部</option>
						<c:forEach var="market" items="${marketList }" varStatus="status">
							<option value="${market.vcode }" >${market.vname }</option>
						</c:forEach>
					</select>
				</div>
				<div class="form-label" style="width:40px">城市</div>
				<div class="form-input"  style="width:105px" >
					<select id="citycode" name="citycode" class="select">
						<option value="">全部</option>
						<c:forEach items="${cityList}" var="city">
							<option value="${city.citycode}" >${city.cityname }</option>
						</c:forEach>
					</select>
				</div>
				<div class="form-label" style="width:40px">门店</div>
				<div class="form-input" style="width:105px" >
					<select id="storecode" name="storecode" class="select">
						<option value="">全部</option>
						<c:forEach items="${storeList}" var="store">
							<option value="${store.vscode}" ><c:out value="${store.vsname}"/></option>
						</c:forEach>
					</select>
				</div>
			</div>
		</form>
		<div class="grid" >
			<div class="table-head" >
				<table cellspacing="0" cellpadding="0">
					<thead>
						<tr>
							<td class="num"><span style="width: 25px;">&nbsp;</span></td>
							<td>
								<span style="width:30px;">
									<input type="checkbox" id="chkAll"/>
								</span>
							</td>
							<td><span style="width:80px;">门店编码</span></td>
							<td><span style="width:180px;">门店名称</span></td>
							<td><span style="width:80px;">城市</span></td>
							<td><span style="width:80px;">市场</span></td>
						</tr>
					</thead>
				</table>
			</div>
			<div class="table-body">
				<table cellspacing="0" cellpadding="0">
					<tbody>
						<c:forEach var="store" items="${storeList}" varStatus="status">
							<tr>
								<td class="num"><span style="width: 25px;">${status.index+1}</span></td>
								<td>
									<span style="width:30px; text-align: center;"><input type="checkbox"  name="idList4" id="chk_<c:out value='${store["PK_STORE"]}' />" value="<c:out value='${store["PK_STORE"]}' />"/></span>
								</td>
								<td><span style="width:80px;"><c:out value='${store["VCODE"]}' />&nbsp;</span></td>
								<td><span style="width:180px;"><c:out value='${store["VNAME"]}' />&nbsp;</span></td>
								<td><span style="width:80px;"><c:out value='${store["CITYNAME"]}' />&nbsp;</span></td>
								<td><span style="width:80px;"><c:out value='${store["MARKETNAME"]}' />&nbsp;</span></td>
							</tr>
						</c:forEach>
					</tbody>
				</table>
			</div>
		</div>
		<script type="text/javascript" src="<%=path%>/js/jquery-1.7.1.js"></script>
		<script type="text/javascript" src="<%=path%>/js/teleFunc.js"></script>
		<script type="text/javascript" src="<%=path%>/js/BoxSelect.js"></script>
		<script type="text/javascript" src="<%=path%>/js/lib.ui.core.js"></script>
		<script type="text/javascript" src="<%=path%>/js/widget/lib.ui.button.js"></script>
		<script type="text/javascript" src="<%=path%>/js/widget/lib.ui.toolbar.js"></script>
		<script type="text/javascript" src="<%=path%>/js/widget/lib.ui.window.js"></script>
		<script type="text/javascript" src="<%=path%>/js/widget/lib.ui.drag.js"></script>
		<script type="text/javascript" src="<%=path%>/js/WdatePicker.js"></script>
		
		<script type="text/javascript">
			var selected;
			$(document).ready(function(){
				$(document).keydown(function(e){
					if(e.keyCode == 13) $("#filterquery").trigger('click');
					//if(e.keyCode == 13) return false;
				});
				selected = '${domId}' == 'selected' ? parent.selected : (typeof(parent['${domId}']) == 'function' ? parent['${domId}']() : $('#${domId}',parent.document).val().split(","));
				$("#toolbar").toolbar({
						items: [/*{
							text: '<fmt:message key="select" />',
							title: '<fmt:message key="select" />',
							useable: <c:out value="${operateMap['select']}" default="false"/>,
							icon: {
								url: '<%=path%>/image/Button/op_owner.gif',
								position: ['0px','-40px']
							},
							handler: function(){
								$("#queryForm").submit();
							}
						},*/{
							text: '<fmt:message key="enter" />',
							useable:true,
							handler: function(){
								var checkboxList = $('.grid').find('.table-body').find(':checkbox');
								var data = {show:[],code:[],mod:[],entity:[],vcode:[]};
								checkboxList.filter(':checked').each(function(){
									if($(this).attr('disabled'))return;//跳过已经<fmt:message key="select1" />的数据
									var entity = {};
									var row = $(this).closest('tr');
									data.code.push($(this).val());
									//<fmt:message key="coding" />
									data.vcode.push($(this).closest('tr').find('td:eq(2)').find('span').text().replace(/^\s+|\s+$/g, ''));
									data.show.push($.trim(row.children('td:eq(3)').text()));
									entity.pk_store = $.trim($(this).val());
									entity.vcode = $.trim(row.children('td:eq(2)').text());
									entity.vname = $.trim(row.children('td:eq(3)').text());
									entity.vinit = $.trim(row.children('td:eq(4)').text());
									entity.pk_market = $.trim(row.children('td:eq(5)').text());
									entity.pk_boh = $.trim(row.children('td:eq(6)').text());
									entity.pk_governor = $.trim(row.children('td:eq(7)').text());
									
									entity.vprnver = $.trim(row.children('td:eq(8)').text());
									entity.vfirmprnver = $.trim(row.children('td:eq(9)').text());
									entity.vprndownver = $.trim(row.children('td:eq(10)').text());
									entity.dprndowntim = $.trim(row.children('td:eq(11)').text());
									
									entity.vpayver = $.trim(row.children('td:eq(12)').text());
									entity.vfirmpaynver = $.trim(row.children('td:eq(13)').text());
									entity.vpaydownver = $.trim(row.children('td:eq(14)').text());
									entity.dpaydowntim = $.trim(row.children('td:eq(15)').text());
									entity.vfoodsign = $(this).closest('td').find('input:eq(2)').val();
									entity.pk_id = $.trim($(this).val());
									data.entity.push(entity);
								});
								if("${domId}" == "selected"){
									parent.selected = data.code;
								}
								parent['${callBack}'](data);
								$(".close",parent.document).click();
							}
						},{
							text: '<fmt:message key="cancel" />',
							useable: true,
							handler: function(){
								$(".close",parent.document).click();
							}
						}
					]
				});
				//自动实现滚动条
				setElementHeight('.grid',['#toolbar'],$(document.body),53);	//计算.grid的高度
				setElementHeight('.table-body',['.table-head'],'.grid');	//计算.table-body的高度
				loadGrid();//  自动计算滚动条的js方法
				$(document).keydown(function(e){
					if(e.keyCode == 13) return false;
				});

				$("#area,#modid,#region").change(function(){
					delay.apply(this,[1,fillData]);
				});
				$('#init').keyup(function(e){
					delay.apply(this,[1,fillData]);
				});
				if(selected){
					$(".table-body").find('tr td input').each(function(){
						if($.inArray($(this).val(),selected) >= 0){
							$(this).attr('checked','checked');
							$(this).attr('disabled','disabled');
						}
					});
				}
				
				$("#filterquery").click(function(){
					$("#queryForm").submit();
// 					var trlist=$(".table-body").find('tbody').find('tr');
// 					var bcode=$.trim($("#vcode").val());
// 					var bname=$.trim($("#vname").val());
// 					var binit=$.trim($("#vinit").val());
// // 					alerterror(bcode+"----"+bname);
// 					if(trlist.length>0){
// 						trlist.each(function(){
// 							var vcode=$(this).find('td span').eq(2).text();
// 							var vname=$(this).find('td span').eq(3).text();
// 							var vinit=$(this).find('td span').eq(4).text();
// // 							alerterror(bcode+"----"+vname);
// 							var bol=false;
// 							if(bcode!=""){
// 								if($.trim(vcode).indexOf(bcode)){
// 									bol=true;
// 								}
// 							}
// 							if(bname!=""){
// 								if($.trim(vname).indexOf(bname)){
// 									bol=true;
// 								}
// 							}
// 							if(binit!=""){
// 								if($.trim(vinit).indexOf(binit)){
// 									bol=true;
// 								}
// 							}
// 							if(bol){
// 								//一旦有不满足<fmt:message key="condition" />,即把这行隐藏,否则现在
// 								$(this).attr("style","display:none");
// 								$(this).find('input').attr("checked", false );
// 							}else{
// 								$(this).attr("style","display: table-row;");
// 							}
							
// 						});
// 					}
				});
				
				/* setElementHeight('.grid',['.tool'],$(document.body),50);	//计算.grid的高度
				setElementHeight('.table-body',['.table-head'],'.grid');				//计算.table-body的高度
				loadGrid();//  自动计算滚动条的js方法 */
				$('.grid').find('.table-body').find('tr').live('mouseover',function(){
					$(this).addClass('tr-over');
				});
				$('.grid').find('.table-body').find('tr').live('mouseout',function(){
					$(this).removeClass('tr-over');
				});
				//当点击tr行的时候,tr行头的checkbox也能被<fmt:message key="selected" />,不用非得点击checkbox才能<fmt:message key="selected" />行
				var mod = '<c:out value="${single}"/>';
				if(mod){
					$('#chkAll').unbind('click');
					$('#chkAll').css('display','none');
				}else{
					$('#chkAll').click(function(){
						if(!this.checked){
							$('.grid').find('.table-body').find('tr').find(':checkbox').removeAttr('checked');
						}else{
							$('.grid').find('.table-body').find('tr').find(':checkbox').attr('checked','checked');
						}
					});
					
				}
				$('.grid').find('.table-body').find('tr').live("click", function () {
					$(this).find(':checkbox').trigger('click');
				 });
				$('.grid').find('.table-body').find('tr').find(':checkbox').live('click',function(event){
					var mod = '<c:out value="${single}"/>';
					if(mod){
						$(this).closest('.table-body').find(':checkbox').not($(this)).removeAttr("checked");
						//$(this).attr('checked','checked');
					}
					event.stopPropagation();
				});
				if(typeof(parent.editTable) == 'function'){
					parent.editTable($('.grid'));
				}
				
				//切换品牌，变换市场
				$('#pk_brand').change(function(){
					var pk_brand =$('#pk_brand').val();
					$('#pk_market').empty();
					$('#pk_market').append($('<option value=""><fmt:message key="all" /></option>'));
					$('#pk_boh').empty();
					$('#pk_boh').append($('<option value=""><fmt:message key="all" /></option>'));
					$('#pk_governor').empty();
					$('#pk_governor').append($('<option value=""><fmt:message key="all" /></option>'));
					$("#queryForm").attr("action","<%=path %>/store/toChooseStore.do");
					$("#queryForm").submit();
				});
				//切换市场，变换运营区
				$('#pk_market').change(function(){
					var pk_market =$('#pk_market').val();
					$('#pk_boh').empty();
					$('#pk_boh').append($('<option value=""><fmt:message key="all" /></option>'));
					$('#pk_governor').empty();
					$('#pk_governor').append($('<option value=""><fmt:message key="all" /></option>'));
					$("#queryForm").attr("action","<%=path %>/store/toChooseStore.do");
					$("#queryForm").submit();
				});
				//根据<fmt:message key="operational_area" /><fmt:message key="select1" /><fmt:message key="select" /><fmt:message key="supervisory_district" />
				$("#pk_boh").change(function(){
					$("#pk_governor").empty();
					$("#pk_governor").append("<option value=''><fmt:message key='all' /></option>");
					$("#queryForm").attr("action","<%=path %>/store/toChooseStore.do");
					$("#queryForm").submit();
				});
				$("#pk_governor").change(function(){
					$("#queryForm").attr("action","<%=path %>/store/toChooseStore.do"); 
					$("#queryForm").submit();
				});
			});
			
			function fillData(){
				$(".table-body").teleUtil('autoFill',{
					url:'<%=path%>/store/findFirm.do',
					param:getParam($('#queryForm')),
					cols:['FIRMID','FIRMDES','AREA','MODNAM'],
					id:'FIRMID',
					selected:selected
				});
			}
			$("#enablestate").change(function(){
				$("#queryForm").attr("action","<%=path %>/store/toChooseStore.do");
				$("#queryForm").submit();
			});
		</script>
	</body>
</html>