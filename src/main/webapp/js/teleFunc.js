var queryParams = {};
var tableHeight = 0;//充满div时，表格高度
var bodyHeight = 0;//iframe body高度
var firstLoad = true;//标记是否为第一次加载
var colChooseWindow;
var fieldMap = {};
//方法延时执行
var delay = function(t,func){
	var self = this;
	if(self.curTime)
		clearTimeout(self.curTime);
	self.curTime = setTimeout(function(){
		func.apply(self);
		},t*1000);
};
//生成工具栏
function builtToolBar(params){
	var form = $('#'+params.formId);//页面formid
	var grid = params.gridId ? $('#'+params.gridId) : params.grid;//表格所在div
	var basePath = params.basePath;
	var curtoolbar = params.toolbar;//需要的工具按钮,可能的值search,excel,print,option,exit
	var searchFun = params.searchFun; //自定义查询方法
	var verifyFun = params.verifyFun;
	var exportTyp = params.exportTyp;//excel导出时获取表头的方式，默认为从数据库查询。设置为true时从页面获取
	var items = [];
	if(grid)grid.data("verifyFun",verifyFun);
	var toolbar = {search:{
		text: $.messager.defaults.search,
		title: $.messager.defaults.search,
		useable:report_search_perm_tele === undefined ? true : report_search_perm_tele,
		icon: {
			url: basePath+'/image/Button/op_owner.gif',
			position: ['0px','-40px']
		},
		handler: function(){
			delay(0.5,function(){
				if(!(verifyFun ? verifyFun() : true))return;
				searchFun ? searchFun(grid,form) :
				grid.datagrid("load",getParam(form));
			});
		}
	},
	excel:{
		text: $.messager.defaults.excel,
		title: $.messager.defaults.excel,
		useable:report_export_perm_tele === undefined ? true : report_export_perm_tele,
		icon: {
			url: basePath+'/image/Button/op_owner.gif',
			position: ['-40px','-20px']
		},
		handler: function(){
			if(!(verifyFun ? verifyFun() : true))return;
			$("#wait2").css("visibility", "visible");
			$("#wait").css("visibility", "visible");
			var headers = [];
			if(exportTyp){
				var panel = grid.datagrid('getPanel');
				var content = panel.panel('body');
				function clearHead(head){
					head.find('table').removeAttr('border').removeAttr('cellspacing').removeAttr('cellpadding');
					head.find('td').each(function(){
						if($(this).css('display') == 'none'){
							$(this).remove();
						}else{
							$(this).removeAttr('class');
							$(this).children('div').html($.trim($(this).text()));
							$(this).children('div').removeAttr('class');
						}
					});
					return head.html();
				}
				headers.push(clearHead(content.find('.datagrid-view').find('.datagrid-view1').find('.datagrid-header-inner').clone()));
				headers.push(clearHead(content.find('.datagrid-view').find('.datagrid-view2').find('.datagrid-header-inner').clone()));
				headers.push("<fieldMap>"+$.toJSON(fieldMap)+"</fieldMap>");
			}
			headers = headers.join("");
			var rs = headers.match(/\w+\s*=\w+/g);
			for(var s in rs){
				var string = String(rs[s]);
				string.match(/(\w+)$/g);
				headers = headers.replace(string,string.replace(RegExp.$1,'"'+RegExp.$1+'"'));
			}
			var head = $("<input type='hidden' name='headers'/>");
			form.find("input[name='headers']").remove();
			head.val(headers.replace(/\r/g,""));
			head.appendTo(form);
			form.attr('action',params.excelUrl);
			form.submit();
			delay(1,function(){
				$("#wait2").css("visibility","hidden");
	 			$("#wait").css("visibility","hidden");
			});
		}
	},
	print:{
		text: $.messager.defaults.print,
		title: $.messager.defaults.print,
		useable:report_print_perm_tele === undefined ? true : report_print_perm_tele,
		icon: {
			url: basePath+'/image/Button/op_owner.gif',
			position: ['-140px','-100px']
		},
		handler: function(){
			if(!(verifyFun ? verifyFun() : true))return;
			form.attr('target','report');
			window.open("about:blank","report",'status=no,toolbar=no,menubar=no,location=no,scrollbars=no,resizable=yes,width='+window.screen.width+',height='+window.screen.height+',top=0,left=0');
			var action=params.printUrl;
			form.attr('action',action);
			form.submit();
		}
	},
	option:{
		text: $.messager.defaults.option,
		title: $.messager.defaults.option,
		useable:true,
		icon: {
			url: basePath+'/image/Button/op_owner.gif',
			position: ['-100px','-60px']
		},
		handler: function(){
			toColsChoose(params.colsChooseUrl);
		}
	},
	exit:{
		text: $.messager.defaults.exit,
		title: $.messager.defaults.exit,
		useable:true,
		icon: {
			url: basePath+'/image/Button/op_owner.gif',
			position: ['-160px','-100px']
		},
		handler: function(){
			invokeClick($(window.parent.parent.document).find('.main').find('.tab-item').find('.button-click').find('.button-arrow').get(0));
		}
	}
	};
	
	for(var i in curtoolbar){
		if(typeof(curtoolbar[i]) == 'string')
			items.push(toolbar[curtoolbar[i]]);
		else
			items.push(curtoolbar[i]);
	}
	$('#'+params.toolbarId).html('');
	$('#'+params.toolbarId).toolbar({
		items:items
	});
	bodyHeight = $(".layout-panel-center",top.document).children('div[region="center"]').height() - $(".tab-control",top.document).height();
	tableHeight = bodyHeight - $("#tool").height() - $("#queryForm").height() - $(".tabs-header").height();
	$('body').height(bodyHeight);
}

//解析获取表单数据

function getParam(form){
	form = form.find("*[name]").filter(function(){
		return $.inArray($(this).attr('type') ? $(this).attr('type').toLowerCase() : undefined ,['button','submit','reset','image','file']) < 0 && $(this).val() 
		&& !$(this).attr('disabled');
	});
	var mul = ['radio','checkbox'];
	var temp = {};
	var param = {};
	form.each(function(){
		this.tagName.toLowerCase() == 'input' ? (temp[$(this).attr('name')] = $(this).attr('type') ? $(this).attr('type') : 'text') : temp[$(this).attr('name')] = this.tagName.toLowerCase();
	});
	for(var i in temp){
		$.inArray(temp[i],mul) < 0 ? param[i] = form.filter(temp[i]+'[name="'+i+'"]').val() ? param[i] = form.filter(temp[i]+'[name="'+i+'"]').val() : form.filter('input[name="'+i+'"]').val()
				: param[i] = form.filter('input[name="'+i+'"]:checked').val();
	}
	queryParams = param;
	return param;
}

//跳转到列选择页面
function toColsChoose(url){
	colChooseWindow = $('body').window({
		title: '列选择',
		content: '<iframe frameborder="0" src='+url+'></iframe>',
		width: '460px',
		height: '430px',
		draggable: true,
		isModal: true,
		confirmClose: false
	});
}

function closeColChooseWin(){
	if(colChooseWindow)
		colChooseWindow.close();
}
//生成表格
function builtTable(params){
	var headUrl = params.headUrl;//获取表头的url
	var width = params.width ? params.width : '100%';
	var contentUrl = params.dataUrl;//获取表格内容的url
	var remoteSort = String(params.remoteSort) != 'undefined' ? params.pagination : true;
	var title = params.title;//表格title
	var grid = params.id ? $('#'+params.id) : params.grid;//表格所在div
	var dateCols = params.dateCols ? params.dateCols.join(',').toLowerCase().split(',') : [];//需要按日期格式化的数据
	var timeCols = params.timeCols ? params.timeCols.join(',').toLowerCase().split(',') : [];//需要按时间格式化的数据
	var numCols = params.numCols ? params.numCols.join(',').toLowerCase().split(',') : [];//需要按数字格式化的数据
	var alignCols = params.alignCols ? params.alignCols.join(',').toLowerCase().split(',') : [];//需要右对齐的列
	var filter = typeof(params.filter) == 'function' ? params.filter : function(data){return data;};//对获取的数据进行格式化的方法
	var singleSelect = String(params.singleSelect) != 'undefined' ? params.singleSelect : true;//是否单选
	var pagination = String(params.pagination) != 'undefined' ? params.pagination : true;//是否显示分页工具条
	var showFooter = String(params.showFooter) != 'undefined' ? params.showFooter : true;//是否显示页脚栏
	var pageList = params.pageList ? params.pageList : [20,30,40,50];//定义分页数目
	var gridHeight = params.height ? params.height : tableHeight;//表格高度
	var onClickRow = params.onClickRow ? params.onClickRow : function(a,b){return;};//表格行单击事件，第一参数为行号，第二参数为改行数据json格式，{field:data}
	var onDblClickRow = params.onDblClickRow ? params.onDblClickRow : function(a,b){return;};
	var rowStyler= params.rowStyler ? params.rowStyler : function() {return 'line-height:11px';};
	var decimalDigitR = params.decimalDigitR ? Number(params.decimalDigitR) : 2;
	var decimalDigitF = params.decimalDigitF ? Number(params.decimalDigitF) : 2;
	var createHeader = params.createHeader ? params.createHeader : undefined; 
	var hiddenCols = params.hiddenCols ? params.hiddenCols : undefined;
	var mergeCellsFun = params.mergeCellsFun ? params.mergeCellsFun : $.noop;
	//Controller传来的map对象，包含所需要显示的报表所有列的dictColumns对象，和需要固定在左侧的col的index（用，分割）
	var tableContent = {};
	//表头行（单行）
	var columns = [];
	//表头（多行），其中元素为columns
	var head = [];
	//需要固定在左侧的列的表头（单行）
	var frozenHead = [];
	//需要固定在左侧的列的表头（多行），元素为frozenHead
	var frozenColumns = [];
	//ajax获取报表表头
	if(headUrl!=null && headUrl!='')
		$.ajax({url:headUrl,
				async:false,
//				data : params.isparam=='true' ?queryParams:null,
				type:'POST',
				success:function(data){
					tableContent = data;
				}
			});
	//解析获取的数据
	if(!createHeader){
		alignCols = alignCols.concat(numCols);
		var frozenIndex = tableContent.frozenColumns ? tableContent.frozenColumns.split(',') : [];
			var Cols = [];
			var colsSecond = [];
		var prev = '';
		var temp;
			for(var i in tableContent.columns)Cols.push(tableContent.columns[i].zhColumnName);
			var t = Cols.toString().match(/,([\d\D]+?)\|[\d\D]+?(?=,)/g);
			if(t && !t.length){
				for(var i in tableContent.columns){
					if(!tableContent.columns[i].properties)continue;
					var align = $.inArray(tableContent.columns[i].properties.toLowerCase(),alignCols) >= 0 ? "right" : "left"; 
		 			if($.inArray(tableContent.columns[i].id,frozenIndex) >= 0)
		 				frozenColumns.push({field:tableContent.columns[i].columnName.toUpperCase(),title:tableContent.columns[i].zhColumnName,width:tableContent.columns[i].columnWidth,sortable:true,align:align});
		 			else
		 				columns.push({field:tableContent.columns[i].columnName.toUpperCase(),title:tableContent.columns[i].zhColumnName,width:tableContent.columns[i].columnWidth,sortable:true,align:align});
		 		}
			head.push(columns);
		 		frozenHead.push(frozenColumns);
			}else{
				for(var i in tableContent.columns){
					if(!tableContent.columns[i].properties)continue;
					var align = $.inArray(tableContent.columns[i].properties.toLowerCase(),alignCols) >= 0 ? "right" : "left"; 
					if($.inArray(tableContent.columns[i].id,frozenIndex) >= 0)
		 				frozenColumns.push({field:tableContent.columns[i].columnName.toUpperCase(),title:tableContent.columns[i].zhColumnName,width:tableContent.columns[i].columnWidth,sortable:true,rowspan:2,align:align});
					else{
						var cur = tableContent.columns[i].zhColumnName.match(/^([\d\D]+)\|[\d\D]+$/g);
						if(cur && cur.length){
							var cur = tableContent.columns[i].zhColumnName;
							if(cur.replace(/^([\d\D]+)\|[\d\D]+$/g,"$1") == prev){
								temp.colspan ++;
							}else{
								temp = {title:cur.replace(/^([\d\D]+)\|[\d\D]+$/g,"$1"),colspan:1};
								columns.push(temp);
								prev = cur.replace(/^([\d\D]+)\|[\d\D]+$/g,"$1");
							}
							colsSecond.push({field:tableContent.columns[i].columnName.toUpperCase(),title:cur.replace(/^([\d\D]+)\|([\d\D]+)$/g,"$2"),width:tableContent.columns[i].columnWidth,sortable:true,colspan:1,align:align});
						}else{
							if(tableContent.columns[i].columnName)
								columns.push({field:tableContent.columns[i].columnName.toUpperCase(),title:tableContent.columns[i].zhColumnName,width:tableContent.columns[i].columnWidth,sortable:true,rowspan:2,align:align});
						}
					}
				}
				head.push(columns);
				head.push(colsSecond);
				if(hiddenCols){
					for(var obj in hiddenCols)
						head[0].push({field:hiddenCols[obj].field,rowspan:head.length,hidden:true});
				}
				frozenHead.push(frozenColumns);
			}
	}else {
		createHeader(tableContent,head,frozenHead);
	}
	
 		//生成报表数据表格
		grid.datagrid({
	 			title:title,
	 			width:width,
	 			height:gridHeight,
	 			nowrap: true,
				striped: true,
				singleSelect:singleSelect,
				collapsible:true,
				//对从服务器获取的数据进行解析格式化selectPrintset
				dataFilter:function(data,type){
					var rs = eval("("+data+")");
					if(createHeader)return $.toJSON(filter(rs,head));
					var modifyRows = [];
					var modifyFooter = [];
					var footer = rs.footer;
					var rows = rs.rows;
					if(!rows || rows.length <= 0)grid.datagrid('loadData',{total:0,rows:[],footer:[]});
					for(var i in rows){
						var cols = tableContent.columns;
						var curRow = {};
						for(var j in cols){
							try{
								var value = eval("rows["+i+"]."+cols[j].properties.toUpperCase());
								//value = $.inArray(cols[j].properties,numCols) >=0 ? (value ? value.toFixed(2) : '0.00') : (value ? ($.inArray(cols[j].properties,dateCols) >= 0 ? convertDate(value) : value):'');
								//-------------------------
								if($.inArray(cols[j].properties.toLowerCase(),numCols) >=0){
									value = value ? Number($.trim(String(value))).toFixed(decimalDigitR) : '0.00';
								}else if(String(value).match(/0|(?:.+)/)){
									if($.inArray(cols[j].properties.toLowerCase(),dateCols) >= 0){
										value = convertDate(value,false);
									}else if($.inArray(cols[j].properties.toLowerCase(),timeCols) >= 0){
										value = convertDate(value,true);
									}
								}else{
									value='';
								}
								//-----------------------------
								curRow[cols[j].columnName.toUpperCase()] = value;
								fieldMap[cols[j].columnName.toUpperCase()] = cols[j].properties.toUpperCase();
							}catch(e){
								console.warn('Exception   '+"rows["+i+"]."+cols[j].properties+"====>"+cols[i].zhColumnName);
							}
						}
						if(hiddenCols){
							for(var obj in hiddenCols)
								curRow[hiddenCols[obj].field] = eval("rows["+i+"]."+hiddenCols[obj].field);
						}
						modifyRows.push(curRow);
					}
					rs.rows = modifyRows;
					for(var i in footer){
						var cols = tableContent.columns;
						var foot = {};
						for(var j in cols){
							try{
								var value = eval("footer["+i+"]."+cols[j].properties.toUpperCase()) ;
								//value = $.inArray(cols[j].properties,numCols) >=0 ? (value ? value.toFixed(2) : '0.00') : (value ? ($.inArray(cols[j].properties,dateCols) >= 0 ? convertDate(value) : value):'');
								value = $.inArray(cols[j].properties,numCols) >=0 ? (value ? Number($.trim(String(value))).toFixed(decimalDigitF) : '0.00') : (String(value).match(/0|(?:.+)/) ? ($.inArray(cols[j].properties,dateCols) >= 0 ? convertDate(value) : value):'');
								foot[cols[j].columnName.toUpperCase()] = value;
							}catch(e){
								console.warn('Exception   '+"footer["+i+"]."+cols[j].properties+"====>"+cols[i].zhColumnName);
							}
						}
						modifyFooter.push(foot);
					}
					rs.footer = modifyFooter;
					rs = filter(rs);
					return $.toJSON(rs);
					function convertDate(time,flag){
						if(isNaN(time)){
							return;
						}
						var date=new Date(time); 
						var str="";     
						str+=date.getFullYear()+"-";     
						str+=((date.getMonth()+1)>9?(date.getMonth()+1):"0"+(date.getMonth()+1))+"-";     
						str+=date.getDate()>9?date.getDate():"0"+date.getDate();
						if(flag){
							str += " "+((date.getHours()>9)?date.getHours():"0"+date.getHours())+":";
							str += ((date.getMinutes()>9)?date.getMinutes():"0"+date.getMinutes())+":";
							str += ((date.getSeconds()>9)?date.getSeconds():"0"+date.getSeconds());
						}
						return str;
					}
				},
				url:contentUrl,
				remoteSort: remoteSort,
				//页码选择项
				pageList:pageList,
				frozenColumns:frozenHead,
				columns:head,
				queryParams:queryParams,
				showFooter:showFooter,
				pagination:pagination,
				rownumbers:true,
				fitColumns:false,
				onClickRow:onClickRow,
				onDblClickRow:onDblClickRow,
				rowStyler:rowStyler,
				onBeforeLoad:function(){
					if(firstLoad){
						firstLoad = false;
						return false;
					}
					if(grid.data("verifyFun") && typeof(grid.data("verifyFun")) == "function"){
						return grid.data("verifyFun")();
					}
				},
				onLoadSuccess:function(data){
					if(data.total==0){
						initone(data);
					}
					mergeCellsFun(data);
				}
	 	});
	 	$(".panel-tool").remove();
}

function initone(data){
	if($("tr[datagrid-row-index='0']").length<=0){//首次进入报表页面，说明没有数据，就进行添加空行
		$('#datagrid').datagrid('insertRow',{
			row: {
			}
		});
		$("tr[datagrid-row-index='0']").css({"visibility":"hidden"});
	}else{
		//否则进行查询操作
		if($('.datagrid-body tbody tr').length==0){ //如果返回0条数据，就添加一行空数据
			$('#datagrid').datagrid('insertRow',{
				row: {
				}
			});
			$("tr[datagrid-row-index='0']").css({"visibility":"hidden"});
		}
	}
}
//新建图表(免费版)
function buildChart(params){
	var swf = params.swf;//展示图表的swf文件路径
	var url = params.url;//生成图表是获取的xml数据的url
	var id = params.id ? params.id : 'myChartId';//生成图表的id
	var width = params.width ? params.width : $('body').width();//生成图表的宽度
	var height = params.height ? params.height : tableHeight;//生成图表的高度
	var form = params.form;//从form中获取需要提交的参数，指定form
	var div = params.div;//生成的图表所在的div
	var para = getParam(form);//提交url时，需附加的参数
	var myChart = new FusionCharts(swf,id,width,height);
	//myChart.addParam("wmode","Opaque");//控制flash显示，防止chart显示在最上层
	$.ajax({
		url:url,
		data:para,
		type:'POST',
		beforeSend:function(){
//			$('#wait2,#wait').css("visibility","visible");
		},
		success:function(data){
 			myChart.setDataXML(data);
 			myChart.render(div);
		},
		complete:function(){
			$('#wait2,#wait').css("visibility","hidden");
		}
	});
}
//选择分店
function selectFirm(params){
	var basePath = params.basePath;
	var url = basePath+"/firm/toChooseFirm.do";
	var callBack = params.callBack ? params.callBack : "setFirm";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseFirm',
		title: '选择分店',
		content: '<iframe id="listFrimFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择加盟规则
function selectJoiningRuler(params){
	var basePath = params.basePath;
	var url = basePath+"/join/toChooseJoiningRuler.do";
	var callBack = params.callBack ? params.callBack : "setJoiningRuler";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseFirm',
		title: '选择加盟规则',
		content: '<iframe id="listPaymodeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//会员选择分店
function crmSelectFirm(params){
	var basePath = params.basePath;
	var url = basePath+"/crmFirm/toChooseFirm.do";
	var callBack = params.callBack ? params.callBack : "setFirm";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseFirm',
		title: '选择分店',
		content: '<iframe id="listFrimFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择类别
function selectPubGrp(params){
	var basePath = params.basePath;
	var url = basePath + "/pubGrp/toChoosePubGrp.do";
	var callBack = params.callBack ? params.callBack : "setPubGrp";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubGrp',
		title: '选择类别',
		content: '<iframe id="listPubGrpFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 400,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择菜谱明细
function selectPubItem(params){
	var basePath = params.basePath;
	var url = basePath+"/pubItem/toChoosePubItem.do";
	var callBack = params.callBack ? params.callBack : "setPubItem";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubItem',
		title: '选择菜谱明细',
		content: '<iframe id="listPubItemFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择菜品
function selectCaiPin(params){
	var basePath = params.basePath;
	var url = basePath+"/gift/toChoosePubitem.do";
	var callBack = params.callBack ? params.callBack : "setPubitem";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubitem',
		title: '选择菜品',
		content: '<iframe id="listPubitemFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 600,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择套餐类型明细
function selectPackages(params){
	var basePath = params.basePath;
	var url = basePath+"/packAges/toChoosePackages.do";
	var callBack = params.callBack ? params.callBack : "setPackages";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubItem',
		title: '选择套餐信息',
		content: '<iframe id="listPubItemFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择(参数字典)
function selectCodDes(params){
	var basePath = params.basePath;
	var url = basePath+"/codDes/toChooseCodDes.do";
	var title = params.title ? params.title : '选择参数字典';
	var callBack = params.callBack ? params.callBack : "setCodDes";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubItem',
		title: title,
		content: '<iframe id="listPubItemFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//限制输入框字数 
$.fn.limitLength = function(inputLength){
	var value = $(this).val();
	var startStr = value.replace(/[^\x00-\xff]/g, "**"); 
	var length = startStr.length; 
	//当填写的字节数小于设置的字节数 
	if (length * 1 <= inputLength * 1){
		return false; 
	}
	var limitStr = startStr.substr(0, inputLength);
	var count = 0; 
	var finalStr = ""; 
	for (var i = 0; i < limitStr.length; i++) { 
		 var flat = limitStr.substr(i, 1); 
		if (flat == "*") { 
			  count++; 
		} 
	} 
	var size = 0; 
	//var istar = startStr.substr(inputLength * 1 - 1, 1);//校验点是否为“×” 
	//if 基点是×; 判断在基点内有×为偶数还是奇数   
	if(count % 2 == 0){ 
		//当为偶数时 
		size = count / 2 + (inputLength * 1 - count); 
	}else{ 
		//当为奇数时 
		size = (count - 1) / 2 + (inputLength * 1 - count); 
	} 
	finalStr = value.substr(0, size); 
	this.val(finalStr); 
	return;			
};

$.getDateFromStr = function(str){
	var date = new Date();
	var reg = /(\d+)\D(\d+)\D(\d+)/;
	str.match(reg);
	date.setFullYear(RegExp.$1,Number(RegExp.$2)-1,RegExp.$3);
	return date;
};
//------------------BOH-begin------------------
//选择分店-BOH-传统界面
function selectStore(params){
	var basePath = params.basePath;
	var url = basePath+"/store/toChooseStore.do";
	var callBack = params.callBack ? params.callBack : "setStore";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&enablestate='+(params.enablestate ? params.enablestate :0);
	url += '&vfoodsign=' + (params.vfoodsign ? params.vfoodsign : '');
	url += '&pk_brandid=' + (params.pk_brand ? params.pk_brand : '');
	url += '&targettable=' + (params.targettable ? params.targettable : '');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseActm',
		title: params.title ? params.title : '选择分店',
		content: '<iframe id="listActmFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 650,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择分店-BOH-新界面
function chooseStore(params){
	var basePath = params.basePath;
	var url = basePath+"/store/selectStores.do";
	var callBack = params.callBack ? params.callBack : "setStore";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&ver='+(params.ver ? params.ver :'1');
	url += '&admin='+(params.admin ? params.admin :'');
	url += '&vfoodsign='+(params.vfoodsign ? params.vfoodsign :'');
	url += '&pk_marketid=' + (params.marketId ? params.marketId : '');
	url += '&pk_bohid=' + (params.bohId ? params.bohId : '');
    url += '&pk_governorid='+(params.governorId?params.governorId:'');
    url += '&enablestate='+(params.enablestate ? params.enablestate :102);
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({

		id: 'window_chooseActm',
		title: params.title ? params.title : '选择分店',
		content: '<iframe id="listStoreFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择BOM类型
function selectAirdit(params){
	var basePath = params.basePath;
	var url = basePath+"/airditType/toChooseAirdit.do";
	var callBack = params.callBack ? params.callBack : "setAirdit";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseFirm',
		title: '选择成本卡类型',
		content: '<iframe id="listAirditFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择支付方式
function selectPaymode(params){
	var basePath = params.basePath;
	var url = basePath+"/paymode/toChoosePaymode.do";
	var callBack = params.callBack ? params.callBack : "setPaymode";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
    url +='&ivalue='+(params.ivalue?params.ivalue:'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseFirm',
		title: '选择支付方式',
		content: '<iframe id="listPaymodeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择附加项类别
function selectRedefineType(params){
	var basePath = params.basePath;
	var url = basePath+"/redefinetype/toChooseRedefineType.do";
	var callBack = params.callBack ? params.callBack : "setRedefineType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseFirm',
		title: '选择附加项类别',
		content: '<iframe id="redefineForm" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择附加项
function selectRedefine(params){
	var basePath = params.basePath;
	var url = basePath+"/redefine/toChooseRedefine.do";
	var callBack = params.callBack ? params.callBack : "setRedefine";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseFirm',
		title: '选择附加项',
		content: '<iframe id="redefineForm" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择活动方案设置选择界面
function selectActm(params){
	var basePath = params.basePath;
	var url = basePath+"/Actm/toChooseActm.do";
	var callBack = params.callBack ? params.callBack : "setActm";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseActm',
		title: params.title ? params.title : '选择活动',
		content: '<iframe id="listActmFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择活动方案设置选择界面(过滤已添加映射的活动)
function selectActmNew(params){
	var basePath = params.basePath;
	var url = basePath+"/Actm/toChooseActmNew.do";
	var callBack = params.callBack ? params.callBack : "setActm";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseActm',
		title: params.title ? params.title : '选择活动',
		content: '<iframe id="listActmFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择菜品设置明细
function selectPubItemBOH(params){
	var basePath = params.basePath;
	var url = basePath+"/pubitem/toChoosePubItem.do";
	var callBack = params.callBack ? params.callBack : "setPubItem";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	//是否把已选择的禁用 默认为禁用（Y-禁用 N-不禁用）
	if(params.disabled!=null && params.disabled!=""){ 
		url += '&disabled='+params.disabled;
	}
	else{ 
		url += '&disabled=Y';
	}
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
//	url += '&pk_cplb='+(params.pk_cplb ? params.pk_cplb :'vgrptyp');//会在下面的循环里面自动拼装
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&pk_parentId='+(params.pk_parentId ? params.pk_parentId :'');//菜品根据类别进行过滤
	url += '&visaddprod='+(params.visaddprod ? params.visaddprod :'');//是否附加产品
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubItem',
		title: params.title ? params.title : '选择菜品设置明细',
		content: '<iframe id="listPubItemFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 520,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择菜品设置明细2
function selectFjiaPubItemBOH(params){
	var basePath = params.basePath;
	var url = basePath+"/pubitemNew/selectFjiaPubItemBOH.do";
	var callBack = params.callBack ? params.callBack : "parseData";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	//是否把已选择的禁用 默认为禁用（Y-禁用 N-不禁用）
	if(params.disabled!=null && params.disabled!=""){ 
		url += '&disabled='+params.disabled;
	}
	else{ 
		url += '&disabled=Y';
	}
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
//	url += '&pk_cplb='+(params.pk_cplb ? params.pk_cplb :'vgrptyp');//会在下面的循环里面自动拼装
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&pk_parentId='+(params.pk_parentId ? params.pk_parentId :'');//菜品根据类别进行过滤
	url += '&pk_typereqdefine='+(params.pk_typereqdefine ? params.pk_typereqdefine :'');//菜品类别设置必选附加项明细时进行过滤
	url += '&pk_Marsaleclass='+(params.pk_Marsaleclass ? params.pk_Marsaleclass :'');//菜品类别设置必选附加项明细时进行过滤
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubItem',
		title: params.title ? params.title : '选择附加菜品',
				content: '<iframe id="listPubItemFrame" frameborder="0" src='+url+'></iframe>',
				width: params.width ? params.width : 520,
						height: params.height ? params.height : 450,
								confirmClose: false,
								draggable: true,
								isModal: true
	});
}

//选择菜品设置明细
function selectPubItemLR(params){
	var basePath = params.basePath;
	var url = basePath+"/pubitem/toChoosePubItemLR.do";
	var callBack = params.callBack ? params.callBack : "setPubItem";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	//是否把已选择的禁用 默认为禁用（Y-禁用 N-不禁用）
	if(params.disabled!=null && params.disabled!=""){ 
		url += '&disabled='+params.disabled;
	}
	else{ 
		url += '&disabled=Y';
	}
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
//	url += '&pk_cplb='+(params.pk_cplb ? params.pk_cplb :'vgrptyp');//会在下面的循环里面自动拼装
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&pk_parentId='+(params.pk_parentId ? params.pk_parentId :'');//菜品根据类别进行过滤
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubItem',
		title: params.title ? params.title : '选择菜品设置明细',
		content: '<iframe id="listPubItemFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 520,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择菜品设置明细---版本2（根据类别分组显示mmw）
function selectPubItemBOHV2(params){
	var basePath = params.basePath;
	var url = basePath+"/pubitem/toChoosePubItemToType.do";
	var callBack = params.callBack ? params.callBack : "setPubItem";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&pk_parentId='+(params.pk_parentId ? params.pk_parentId :'');//菜品根据类别进行过滤
	if(params.showPubpack) {//是否显示套餐数据
		url += '&showPubpack=true';
	}else{
		url += '&showPubpack=false';
	}
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubItem',
		title: params.title ? params.title : '选择菜品设置明细',
		content: '<iframe id="listPubItemFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 520,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择套餐明细
function selectPubpack(params){
	var basePath = params.basePath;
	var url = basePath+"/pubpackage/toChoosePubpack.do";
	var callBack = params.callBack ? params.callBack : "setPubpack";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&pk_tclb='+(params.pk_tclb ? params.pk_tclb :'');
	url += '&pk_parentId='+(params.pk_parentId ? params.pk_parentId :'');//套餐根据类别进行过滤
	url += '&pk_brand='+(params.pk_brand ? params.pk_brand :'');//套餐根据类别进行过滤
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubpack',
		title: params.title ? params.title : '选择套餐明细',
		content: '<iframe id="listPubpackFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择套餐明细(左右结构)
function selectPubpackLR(params){
	var basePath = params.basePath;
	var url = basePath+"/pubpackage/toChoosePubpackLR.do";
	var callBack = params.callBack ? params.callBack : "setPubpack";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&pk_tclb='+(params.pk_tclb ? params.pk_tclb :'');
	url += '&pk_parentId='+(params.pk_parentId ? params.pk_parentId :'');//套餐根据类别进行过滤
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubpack',
		title: params.title ? params.title : '选择套餐明细',
		content: '<iframe id="listPubpackFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择套餐类别
function selectPackagetype(params){
	var basePath = params.basePath;
	var url = basePath+"/packagetype/toChoosePackagetype.do";
	var callBack = params.callBack ? params.callBack : "setPackagetype";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePackagetype',
		title: params.title ? params.title : '选择套餐类别明细',
		content: '<iframe id="listPackagetypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择菜品类别
function selectMarsaleclass(params){
	var basePath = params.basePath;
	var url = basePath+"/Marsaleclass/toChooseMarsaleclass.do";
	var type = params.type ? params.type : "0";//默认加载大类
	url += ("?type="+type);
	url += params.Isonly ? '&Isonly='+params.Isonly : '&Isonly=false';//默认能选择大中小类，true：是只能单选一个类别的菜品
	var callBack = params.callBack ? params.callBack : "setMarsaleclass";
	url += ("&callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.addPackage?'&addPackage='+params.addPackage : '&addPackage=';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseMarsaleclass',
		title: params.title ? params.title : '选择菜品类别明细',
		content: '<iframe id="listMarsaleclassFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 600,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择市场
function selectMarket(params){
	var basePath = params.basePath;
	var url = basePath+"/cboh_Market/toChooseMarket.do";
	var callBack = params.callBack ? params.callBack : "setMarket";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseMarket',
		title: '选择市场',
		content: '<iframe id="listCbohMarketFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//跳出父页面到顶页面进行选择市场
function selectMarket2(params){
	var basePath = params.basePath;
	var url = basePath+"/cboh_Market/toChooseMarket.do";
	var callBack = params.callBack ? params.callBack : "setMarket";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&type=parent'; //标识是跳出父页面进行选择
	url += '&frameid='+(params.frameid ? params.frameid :'');; //标识本页面的frameid
	url += '&rightlimit='+(params.rightlimit ? params.rightlimit :''); //权限限制
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return parent.$('body').window({
		id: 'window_chooseMarket',
		title: '选择市场',
		content: '<iframe id="listCbohMarketFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//餐厅类型
function selectRestauranttype(params){
	var basePath = params.basePath;
	var url = basePath+"/Restauranttype/toChooseRestauranttype.do";
	var callBack = params.callBack ? params.callBack : "setRestauranttype";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id : 'selecttype');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseRestauranttype',
		title: '选择餐厅类型',
		content: '<iframe id="listRestauranttypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//餐厅品牌
function selectBrand(params){
	var basePath = params.basePath;
	var url = basePath+"/Brand/toChooseBrand.do";
	var callBack = params.callBack ? params.callBack : "setBrand";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseBrand',
		title: '选择品牌',
		content: '<iframe id="listBrandFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//跳出父页面到顶页面进行选择市场
function selectBrand2(params){
	var basePath = params.basePath;
	var url = basePath+"/Brand/toChooseBrand.do";
	var callBack = params.callBack ? params.callBack : "setBrand";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&type=parent'; //标识是跳出父页面进行选择
	url += '&frameid='+(params.frameid ? params.frameid :'');; //标识本页面的frameid
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return parent.$('body').window({
		id: 'window_chooseBrand',
		title: '选择品牌',
		content: '<iframe id="listBrandFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//商圈类型设置
function selectBusinesstype(params){
	var basePath = params.basePath;
	var url = basePath+"/Businesstype/toChooseBusinesstype.do";
	var callBack = params.callBack ? params.callBack : "setBusinesstype";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseBusinesstype',
		title: '选择商圈类型',
		content: '<iframe id="listBusinesstypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//法人类型设置
function selectJuridical(params){
	var basePath = params.basePath;
	var url = basePath+"/Juridical/toChooseJuridical.do";
	var callBack = params.callBack ? params.callBack : "setJuridical";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseJuridical',
		title: '选择法人类型',
		content: '<iframe id="listJuridicalFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//运营区设置
function selectCbohboh(params){
	var basePath = params.basePath;
	var url = basePath+"/Cboh_boh/toChooseCbohboh.do";
	var callBack = params.callBack ? params.callBack : "setCbohboh";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
    url +='&marketId='+(params.marketId?params.marketId:'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseCbohboh',
		title: '选择运营区',
		content: '<iframe id="listCbohbohFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//跳出父页面选择运营区
function selectCbohboh2(params) {
	var basePath = params.basePath;
	var url = basePath + "/Cboh_boh/toChooseCbohboh.do";
	var callBack = params.callBack ? params.callBack : "setCbohboh";
	url += ("?callBack=" + callBack);
	url += params.domId ? '&domId=' + params.domId : '&domId=selected';
	if (params.single)
		url += '&single=true';
	// pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id=' + (params.pk_id ? params.pk_id : '');
	url += '&marketId=' + (params.marketId ? params.marketId : '');
	url += '&type=parent'; //标识是跳出父页面进行选择
	url += '&frameid='+(params.frameid ? params.frameid :'');; //标识本页面的frameid
	url += '&rightlimit='+(params.rightlimit ? params.rightlimit :''); //权限限制
	var data = params.param;
	for ( var i in data) {
		url += ('&' + i + '=' + data[i]);
	}
	return parent.$('body').window(
			{
				id : 'window_chooseCbohboh',
				title : '选择运营区',
				content : '<iframe id="listCbohbohFrame" frameborder="0" src='
						+ url + '></iframe>',
				width : params.width ? params.width : 500,
				height : params.height ? params.height : 450,
				confirmClose : false,
				draggable : true,
				isModal : true
			});
}

//督导区设置
function selectGovernor(params){
	var basePath = params.basePath;
	var url = basePath+"/Governor/toChooseGovernor.do";
	var callBack = params.callBack ? params.callBack : "setGovernor";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&marketId=' + (params.marketId ? params.marketId : '');
    url +='&bohId='+(params.bohId?params.bohId:'');
    url +='&pk_brand='+(params.pk_brand?params.pk_brand:'');
    url += '&rightlimit='+(params.rightlimit ? params.rightlimit :''); //权限限制
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseGovernor',
		title: '选择督导区',
		content: '<iframe id="listGovernorFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 750,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//统计类别参照
function selectSecType(params){
	var basePath = params.basePath;
	var url = basePath+"/SecType/toChooseSecType.do";
	var callBack = params.callBack ? params.callBack : "setSecType";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseSecType',
		title: '选择统计类别',
		content: '<iframe id="listSecTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//辅助类别参照
function selectTypoth(params){
	var basePath = params.basePath;
	var url = basePath+"/Typoth/toChooseTypoth.do";
	var callBack = params.callBack ? params.callBack : "setTypoth";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseTypoth',
		title: '选择辅助类别',
		content: '<iframe id="listTypothFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//计量单位参照界面设置
function selectMeasdoc(params){
	var basePath = params.basePath;
	var url = basePath+"/Measdoc/toChooseMeasdoc.do";
	var callBack = params.callBack ? params.callBack : "setMeasdoc";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseMeasdoc',
		title: '选择计量单位',
		content: '<iframe id="listMeasdocFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择支付类型
function selectPayment(params){
	var basePath = params.basePath;
	var url = basePath+"/Payment/toChoosePayment.do";
	var callBack = params.callBack ? params.callBack : "setPayment";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&pk_selectId='+(params.pk_selectId ? params.pk_selectId :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePayment',
		title: '选择支付类型',
		content: '<iframe id="listPaymentFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择结算方式
function selectBalaType(params){
	var basePath = params.basePath;
	var url = basePath+"/BalaType/toChooseBalaType.do";
	var callBack = params.callBack ? params.callBack : "setBalaType";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseBalaType',
		title: params.title ? params.title : '选择结算方式',
		content: '<iframe id="listBalaTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择固有科目
function selectSettlement(params){
	var basePath = params.basePath;
	var url = basePath+"/BalaType/toChooseSettlement.do";
	var callBack = params.callBack ? params.callBack : "setBalaType";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseSettlement',
		title: params.title ? params.title : '选择固有科目',
		content: '<iframe id="listSettlementFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择币种
function selectCurrency(params){
	var basePath = params.basePath;
	var url = basePath+"/Currency/toChooseCurrency.do";
	var callBack = params.callBack ? params.callBack : "setCurrency";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseCurrency',
		title: '选择币种',
		content: '<iframe id="listCurrencyFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择账户类型
function selectAccountType(params){
	var basePath = params.basePath;
	var url = basePath+"/AccountType/toChooseAccountType.do";
	var callBack = params.callBack ? params.callBack : "setAccountType";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseAccountType',
		title: '选择结算方式',
		content: '<iframe id="listAccountTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//门店角色选择
function selectStoreRole(params){
	var basePath = params.basePath;
	var url = basePath+"/storerole/toChooseStoreRole.do";
	var callBack = params.callBack ? params.callBack : "setStoreRole";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&vfoodsign=' + (params.vfoodsign ? params.vfoodsign : '');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseAccountType',
		title: '选择门店角色',
		content: '<iframe id="listStoreRoleFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

/////////////////////////////////////////////////////////////////////////////////////
//动态加载下拉框数据
function builtSelect(select,curVal,content){
	 var _select_content = content ? content : select_content; 
		if(!_select_content.content || _select_content.content == 'init'){
			var content = {};
			$.ajaxSetup({ 
				  async: false 
				  });
			$.get(select.attr('url'),function(data){
				content = [];
				for(var i in data){
					if(data[i])
						content.push({key:data[i][select.attr('key')],value:data[i][select.attr('data')]});
				}
			});
			for(var i in content){
				var option = $('<option></option>');
				option.val(content[i]['key']);
				option.text(content[i]['value']);
				if(Number($.trim(content[i]['key'])) == Number(curVal))
					option.attr('selected','selected');
				option.appendTo(select);
				_select_content.content = select.clone();
				}
		}else{
			_select_content.content.find('option').removeAttr('selected');
			_select_content.content.find('option[value="'+curVal+'"]').attr('selected','selected');
			select.html(_select_content.content.html()); 
		}
		return select;
}

//选择场景按钮事件
function selectButtonevent(params){
	var basePath = params.basePath;
	var url = basePath+"/buttonevent/toChooseButtonevent.do";
	var callBack = params.callBack ? params.callBack : "setButtonevent";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '':'&pk_id='+params.pk_id;
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择按钮事件',
		content: '<iframe id="listButtoneventFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择PAD类别
function selectPadType(params){
	var basePath = params.basePath;
	var url = basePath+"/IPad/toChooseIPadType.do";
	var callBack = params.callBack ? params.callBack : "setIPadType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择PAD类别',
		content: '<iframe id="listPadTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择台位类型
function selectSiteType(params){
	var basePath = params.basePath;
	var url = basePath+"/siteType/toChooseSiteType.do";
	var callBack = params.callBack ? params.callBack : "setSiteType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_sitetype=="undefined"||params.pk_sitetype=="" ? '&pk_id='+params.pk_sitetype : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseSiteType',
		title: '选择台位类型',
		content: '<iframe id="listSiteTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择餐厅区域
function selectStoreArear(params){
	var basePath = params.basePath;
	var url = basePath+"/storeArear/toChooseStoreArear.do";
	var callBack = params.callBack ? params.callBack : "setStoreArear";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_storearear!="undefined"||params.pk_storearear!="" ? '&pk_id='+params.pk_storearear : '';
    url += params.pk_store!="undefined"||params.pk_store!="" ? '&pk_store='+params.pk_store : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseSiteType',
		title: '选择餐厅区域',
		content: '<iframe id="listSiteTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择餐厅区域
function selectStorePrint(params){
	var basePath = params.basePath;
	var url = basePath+"/storePrint/toChooseStorePrint.do";
	var callBack = params.callBack ? params.callBack : "setStorePrint";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_storeprn=="undefined"||params.pk_storeprn=="" ? '&pk_id='+params.pk_storeprn : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseSiteType',
		title: '选择门店打印机',
		content: '<iframe id="listSiteTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//打印机选择
function selectPrintset(params){
	var basePath = params.basePath;
	var url = basePath+"/printset/toChoosePrintset.do";
	var callBack = params.callBack ? params.callBack : "setPrintset";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseAccountType',
		title: '选择打印机',
		content: '<iframe id="listStoreRoleFrame" frameborder="0" src='+url+'></iframe>',
		width:400,
		height:300,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择pos编号
function selectStorePos(params,pk_store){
	var basePath = params.basePath;
	var url = basePath+"/storePos/toChooseStorePos.do";
	var callBack = params.callBack ? params.callBack : "setStorePos";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += '&pk_store='+pk_store;
	if(params.single) url += '&single=true';
	url += params.isreport ? '&isreport=' + params.isreport : '&isreport=false';//是否报表，如果是的话，选择pos界面不显示新增按钮
	return $('body').window({
		id: 'window_chooseSiteType',
		title: '选择POS编号',
		content: '<iframe id="listSiteTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//选择父台位
function selectFatherSite(params){
	var basePath = params.basePath;
	var url = basePath+"/siteManage/toChooseFatherSite.do";
	var callBack = params.callBack ? params.callBack : "setFatherSite";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseSiteType',
		title: '选择父台位',
		content: '<iframe id="listSiteTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//获取固定字体
function getFonts(){
	return $("<option value='Aharoni' dir='ltr'>Aharoni</option><option value='Andalus' dir='ltr'>Andalus</option><option value='Angsana New' dir='ltr'>Angsana New</option><option value='AngsanaUPC' dir='ltr'>AngsanaUPC</option><option value='Aparajita' dir='ltr'>Aparajita</option><option value='Arabic Typesetting' dir='ltr'>Arabic Typesetting</option><option value='Arial' dir='ltr'>Arial</option><option value='Arial Black' dir='ltr'>Arial Black</option><option value='Batang' dir='ltr'>Batang</option><option value='BatangChe' dir='ltr'>BatangChe</option><option value='Browallia New' dir='ltr'>Browallia New</option><option value='BrowalliaUPC' dir='ltr'>BrowalliaUPC</option><option value='Calibri' dir='ltr'>Calibri</option><option value='Calibri Light' dir='ltr'>Calibri Light</option><option value='Cambria' dir='ltr'>Cambria</option><option value='Cambria Math' dir='ltr'>Cambria Math</option><option value='Candara' dir='ltr'>Candara</option><option value='Comic Sans MS' dir='ltr'>Comic Sans MS</option><option value='Consolas' dir='ltr'>Consolas</option><option value='Constantia' dir='ltr'>Constantia</option><option value='Corbel' dir='ltr'>Corbel</option><option value='Cordia New' dir='ltr'>Cordia New</option><option value='CordiaUPC' dir='ltr'>CordiaUPC</option><option value='Courier' dir='ltr'>Courier</option><option value='Courier New' dir='ltr'>Courier New</option><option value='DFKai-SB' dir='ltr'>DFKai-SB</option><option value='DaunPenh' dir='ltr'>DaunPenh</option><option value='David' dir='ltr'>David</option><option value='DilleniaUPC' dir='ltr'>DilleniaUPC</option><option value='DokChampa' dir='ltr'>DokChampa</option><option value='Dotum' dir='ltr'>Dotum</option><option value='DotumChe' dir='ltr'>DotumChe</option><option value='Ebrima' dir='ltr'>Ebrima</option><option value='Estrangelo Edessa' dir='ltr'>Estrangelo Edessa</option><option value='EucrosiaUPC' dir='ltr'>EucrosiaUPC</option><option value='Euphemia' dir='ltr'>Euphemia</option><option value='Fixedsys' dir='ltr'>Fixedsys</option><option value='FrankRuehl' dir='ltr'>FrankRuehl</option><option value='Franklin Gothic Medium' dir='ltr'>Franklin Gothic Medium</option><option value='FreesiaUPC' dir='ltr'>FreesiaUPC</option><option value='Gabriola' dir='ltr'>Gabriola</option><option value='Gautami' dir='ltr'>Gautami</option><option value='Georgia' dir='ltr'>Georgia</option><option value='Gisha' dir='ltr'>Gisha</option><option value='Gulim' dir='ltr'>Gulim</option><option value='GulimChe' dir='ltr'>GulimChe</option><option value='Gungsuh' dir='ltr'>Gungsuh</option><option value='GungsuhChe' dir='ltr'>GungsuhChe</option><option value='Impact' dir='ltr'>Impact</option><option value='IrisUPC' dir='ltr'>IrisUPC</option><option value='Iskoola Pota' dir='ltr'>Iskoola Pota</option><option value='JasmineUPC' dir='ltr'>JasmineUPC</option><option value='Kalinga' dir='ltr'>Kalinga</option><option value='Kartika' dir='ltr'>Kartika</option><option value='Khmer UI' dir='ltr'>Khmer UI</option><option value='KodchiangUPC' dir='ltr'>KodchiangUPC</option><option value='Kokila' dir='ltr'>Kokila</option><option value='Lao UI' dir='ltr'>Lao UI</option><option value='Latha' dir='ltr'>Latha</option><option value='Leelawadee' dir='ltr'>Leelawadee</option><option value='Levenim MT' dir='ltr'>Levenim MT</option><option value='LilyUPC' dir='ltr'>LilyUPC</option><option value='Lucida Console' dir='ltr'>Lucida Console</option><option value='Lucida Sans Unicode' dir='ltr'>Lucida Sans Unicode</option><option value='MS Gothic' dir='ltr'>MS Gothic</option><option value='MS Mincho' dir='ltr'>MS Mincho</option><option value='MS PGothic' dir='ltr'>MS PGothic</option><option value='MS PMincho' dir='ltr'>MS PMincho</option><option value='MS Sans Serif' dir='ltr'>MS Sans Serif</option><option value='MS Serif' dir='ltr'>MS Serif</option><option value='MS UI Gothic' dir='ltr'>MS UI Gothic</option><option value='MT Extra' dir='ltr'>MT Extra</option><option value='MV Boli' dir='ltr'>MV Boli</option><option value='Malgun Gothic' dir='ltr'>Malgun Gothic</option><option value='Mangal' dir='ltr'>Mangal</option><option value='Marlett' dir='ltr'>Marlett</option><option value='Meiryo' dir='ltr'>Meiryo</option><option value='Meiryo UI' dir='ltr'>Meiryo UI</option><option value='Microsoft Himalaya' dir='ltr'>Microsoft Himalaya</option><option value='Microsoft JhengHei' dir='ltr'>Microsoft JhengHei</option><option value='Microsoft New Tai Lue' dir='ltr'>Microsoft New Tai Lue</option><option value='Microsoft PhagsPa' dir='ltr'>Microsoft PhagsPa</option><option value='Microsoft Sans Serif' dir='ltr'>Microsoft Sans Serif</option><option value='Microsoft Tai Le' dir='ltr'>Microsoft Tai Le</option><option value='Microsoft Uighur' dir='ltr'>Microsoft Uighur</option><option value='Microsoft Yi Baiti' dir='ltr'>Microsoft Yi Baiti</option><option value='MingLiU' dir='ltr'>MingLiU</option><option value='MingLiU-ExtB' dir='ltr'>MingLiU-ExtB</option><option value='MingLiU_HKSCS' dir='ltr'>MingLiU_HKSCS</option><option value='MingLiU_HKSCS-ExtB' dir='ltr'>MingLiU_HKSCS-ExtB</option><option value='Miriam' dir='ltr'>Miriam</option><option value='Miriam Fixed' dir='ltr'>Miriam Fixed</option><option value='Modern' dir='ltr'>Modern</option><option value='Mongolian Baiti' dir='ltr'>Mongolian Baiti</option><option value='MoolBoran' dir='ltr'>MoolBoran</option><option value='Narkisim' dir='ltr'>Narkisim</option><option value='Nyala' dir='ltr'>Nyala</option><option value='PMingLiU' dir='ltr'>PMingLiU</option><option value='PMingLiU-ExtB' dir='ltr'>PMingLiU-ExtB</option><option value='Palatino Linotype' dir='ltr'>Palatino Linotype</option><option value='Plantagenet Cherokee' dir='ltr'>Plantagenet Cherokee</option><option value='Raavi' dir='ltr'>Raavi</option><option value='Rod' dir='ltr'>Rod</option><option value='Roman' dir='ltr'>Roman</option><option value='Sakkal Majalla' dir='ltr'>Sakkal Majalla</option><option value='Script' dir='ltr'>Script</option><option value='Segoe Print' dir='ltr'>Segoe Print</option><option value='Segoe Script' dir='ltr'>Segoe Script</option><option value='Segoe UI' dir='ltr'>Segoe UI</option><option value='Segoe UI Light' dir='ltr'>Segoe UI Light</option><option value='Segoe UI Semibold' dir='ltr'>Segoe UI Semibold</option><option value='Segoe UI Symbol' dir='ltr'>Segoe UI Symbol</option><option value='Shonar Bangla' dir='ltr'>Shonar Bangla</option><option value='Shruti' dir='ltr'>Shruti</option><option value='SimSun-ExtB' dir='ltr'>SimSun-ExtB</option><option value='Simplified Arabic' dir='ltr'>Simplified Arabic</option><option value='Simplified Arabic Fixed' dir='ltr'>Simplified Arabic Fixed</option><option value='Small Fonts' dir='ltr'>Small Fonts</option><option value='Sylfaen' dir='ltr'>Sylfaen</option><option value='Symbol' dir='ltr'>Symbol</option><option value='System' dir='ltr'>System</option><option value='Tahoma' dir='ltr'>Tahoma</option><option value='TeamViewer8' dir='ltr'>TeamViewer8</option><option value='Terminal' dir='ltr'>Terminal</option><option value='Times New Roman' dir='ltr'>Times New Roman</option><option value='Traditional Arabic' dir='ltr'>Traditional Arabic</option><option value='Trebuchet MS' dir='ltr'>Trebuchet MS</option><option value='Tunga' dir='ltr'>Tunga</option><option value='Utsaah' dir='ltr'>Utsaah</option><option value='Vani' dir='ltr'>Vani</option><option value='Verdana' dir='ltr'>Verdana</option><option value='Vijaya' dir='ltr'>Vijaya</option><option value='Vrinda' dir='ltr'>Vrinda</option><option value='Webdings' dir='ltr'>Webdings</option><option value='Wingdings' dir='ltr'>Wingdings</option><option value='仿宋' dir='ltr'>仿宋</option><option value='宋体' dir='ltr'>宋体</option><option value='微软雅黑' dir='ltr'>微软雅黑</option><option value='新宋体' dir='ltr'>新宋体</option><option value='楷体' dir='ltr'>楷体</option><option value='黑体' dir='ltr'>黑体</option>");
}

//选择费用类别
function selectExpenseTyp(params){
	var basePath = params.basePath;
	var url = basePath+"/expensetyp/toChooseExpenseTyp.do";
	var callBack = params.callBack ? params.callBack : "setExpenseTyp";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseAccountType',
		title: '选择费用类别',
		content: '<iframe id="listExpenseTypFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择加盟商档案
function selectTrader(params){
	var basePath = params.basePath;
	var url = basePath+"/joiningtrader/toChooseTrader.do";
	var callBack = params.callBack ? params.callBack : "setTrader";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseTrader',
		title: params.title ? params.title : '选择加盟商档案',
		content: '<iframe id="listTraderFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 520,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//只能输入数字
function IsNum(e) {
    var k = window.event ? e.keyCode : e.which;
    if (((k >= 48) && (k <= 57)) || k == 8 || k == 0) {
    } else {
        if (window.event) {
            window.event.returnValue = false;
        }
        else {
            e.preventDefault(); //for firefox 
        }
    }
}
//会员选择界面
function chooseCardtyp(params){
	var basePath = params.basePath;
	var url = basePath+"/Actm/toChooseCardtyp.do";
	var callBack = params.callBack ? params.callBack : "setActm";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	//url += '&id='+(params.id ? params.id :'');
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&ifyz='+(params.ifyz ? params.ifyz : 0);//是否雅座会员
	//url += '&pk_parentId='+(params.pk_parentId ? params.pk_parentId :'');//套餐根据类别进行过滤
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseActm',
		title: params.title ? params.title : '选择会员',
		content: '<iframe id="listActmFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//-----------------------------------------------人事管理begin-------------------------------
//员工职级
function selectRank(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeRank/toChooseRank.do";
	var callBack = params.callBack ? params.callBack : "setRank";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择员工类别',
		content: '<iframe id="listRankFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//职位名称
function selectPosition(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeePosition/toChoosePosition.do";
	var callBack = params.callBack ? params.callBack : "setPosition";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择职位名称',
		content: '<iframe id="listPositionFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//人员类别
function selectEmployeeCategories(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeCategories/toChooseCategories.do";
	var callBack = params.callBack ? params.callBack : "setEmployeeCategories";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择人员类别',
		content: '<iframe id="listCategoriesFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//离职类型
function selectQuitType(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeCategories/toChooseQuitType.do";
	var callBack = params.callBack ? params.callBack : "setQuitType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择离职类型',
		content: '<iframe id="listQuitTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//奖励类型
function selectRewardType(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeRewardType/toChooseRewardType.do";
	var callBack = params.callBack ? params.callBack : "setRewardType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择奖励类型',
		content: '<iframe id="listRewardTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//处分类型
function selectRewardType(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeePunishType/toChoosePunishType.do";
	var callBack = params.callBack ? params.callBack : "setPunishType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择处分类型',
		content: '<iframe id="listPunishTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//补扣款类型
function selectRewardType(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeReplenishType/toChooseReplenishType.do";
	var callBack = params.callBack ? params.callBack : "setReplenishType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择补扣款类型',
		content: '<iframe id="listReplenishTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//部门
function selectDepartment(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeDepartment/toChooseDepartment.do";
	var callBack = params.callBack ? params.callBack : "setEmployeeDepartment";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择部门',
		content: '<iframe id="listEmployeeDepartmentFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//发薪银行
function selectPayBank(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeePayBank/toChoosePayBank.do";
	var callBack = params.callBack ? params.callBack : "setPayBank";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择发薪银行',
		content: '<iframe id="listPayBankFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//异动类型
function selectChangesType(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeChangesType/toChooseChangesType.do";
	var callBack = params.callBack ? params.callBack : "setChangesType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择异动类型',
		content: '<iframe id="listChangesTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//合同变更类型
function selectAgreementChange(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeAgreementChange/toChooseAgreementChange.do";
	var callBack = params.callBack ? params.callBack : "setAgreementChange";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择合同变更类型',
		content: '<iframe id="listAgreementChangeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//合同期限
function selectAgreementTerm(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeAgreementTerm/toChooseAgreementTerm.do";
	var callBack = params.callBack ? params.callBack : "setAgreementTerm";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择合同期限',
		content: '<iframe id="listAgreementTermFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//评估类型
function selectAgreementTerm(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeAssessmentType/toChooseAssessmentType.do";
	var callBack = params.callBack ? params.callBack : "setAssessmentType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择评估类型',
		content: '<iframe id="listAssessmentTypeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//反签原因
function selectAgreementTerm(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeAntisigned/toChooseAntisigned.do";
	var callBack = params.callBack ? params.callBack : "setAntisigned";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择反签原因',
		content: '<iframe id="listAntisignedFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//处分辅助措施
function selectAgreementTerm(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeePunishAssist/toChoosePunishAssist.do";
	var callBack = params.callBack ? params.callBack : "setPunishAssist";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择处分辅助措施',
		content: '<iframe id="listPunishAssistFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//奖/惩性质
function selectAgreementTerm(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeRewAndPun/toChooseRewAndPun.do";
	var callBack = params.callBack ? params.callBack : "setRewAndPun";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择奖/惩性质',
		content: '<iframe id="listRewAndPunFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//学历
function selectEducation(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeEducation/toChooseEducation.do";
	var callBack = params.callBack ? params.callBack : "setEducation";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择学历',
		content: '<iframe id="listEducationFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//用工方式
function selectEmploymentMode(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeEmploymentMode/toChooseEmploymentMode.do";
	var callBack = params.callBack ? params.callBack : "setEmploymentMode";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择用工方式',
		content: '<iframe id="listEmploymentModeFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//人事系统参数
function selectPersonnelParameters(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeePersonnelParameters/toChoosePersonnelParameters.do";
	var callBack = params.callBack ? params.callBack : "setPersonnelParameters";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择人事系统参数',
		content: '<iframe id="listPersonnelParametersFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//员工来源
function selectStaffSource(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeStaffSource/toChooseStaffSource.do";
	var callBack = params.callBack ? params.callBack : "setStaffSource";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择员工来源',
		content: '<iframe id="listStaffSourceFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//政治面貌
function selectPoliticalStatus(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeePoliticalStatus/toChoosePoliticalStatus.do";
	var callBack = params.callBack ? params.callBack : "setPoliticalStatus";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择政治面貌',
		content: '<iframe id="listPoliticalStatusFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//民族
function selectNation(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeNation/toChoosePoliticalStatus.do";
	var callBack = params.callBack ? params.callBack : "setNation";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择民族',
		content: '<iframe id="listNationFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//婚姻状况
function selectMaritalStatus(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeePoliticalStatus/toChooseMaritalStatus.do";
	var callBack = params.callBack ? params.callBack : "setMaritalStatus";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择婚姻状况',
		content: '<iframe id="listMaritalStatusFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//进店方式
function selectIntoStore(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeIntoStore/toChooseIntoStore.do";
	var callBack = params.callBack ? params.callBack : "setIntoStore";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择进店方式',
		content: '<iframe id="listIntoStoreFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//户口性质
function selectAccountNature(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeAccountNature/toChooseAccountNature.do";
	var callBack = params.callBack ? params.callBack : "setAccountNature";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择户口性质',
		content: '<iframe id="listAccountNatureFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//员工籍贯
function selectNativePlace(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeNativePlace/toChooseNativePlace.do";
	var callBack = params.callBack ? params.callBack : "setAccountNature";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择员工籍贯',
		content: '<iframe id="listNativePlaceFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//招聘渠道
function selectRecruitmentChannels(params){
	var basePath = params.basePath;
	var url = basePath+"/EmployeeRecruitmentChannels/toChooseRecruitmentChannels.do";
	var callBack = params.callBack ? params.callBack : "setRecruitmentChannels";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '选择招聘渠道',
		content: '<iframe id="listRecruitmentChannelsFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//工作站区域维护
function selectWsArea(params){
	var basePath = params.basePath;
	var url = basePath+"/TrainingWsArea/toChooseWsArea.do";
	var callBack = params.callBack ? params.callBack : "setWsArea";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '工作站区域',
		content: '<iframe id="listWsAreaFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//工作站
function selectWsWorkStation(params){
	var basePath = params.basePath;
	var url = basePath+"/TrainingWsWorkStation/toChooseWsWorkStation.do";
	var callBack = params.callBack ? params.callBack : "setWsWorkStation";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '工作站',
		content: '<iframe id="listWsWorkStationFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
function selectWorkHourType(params){
	var basePath = params.basePath;
	var url = basePath+"/TrainingWorkHourType/toChooseWorkHourType.do";
	var callBack = params.callBack ? params.callBack : "setWorkHourType";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	url += params.join_id=="undefined"?"&join_id=":"&join_id="+params.join_id+"";
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '工时分类',
		content: '<iframe id="listWsAreaFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

function selectWorkHour(params){
	var basePath = params.basePath;
	var url = basePath+"/TrainingWorkHour/toChooseWorkHour.do";
	var callBack = params.callBack ? params.callBack : "setWorkHour";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.pk_id=="undefined"||params.pk_id=="" ? '&pk_id='+params.pk_id : '';
	url += params.join_id=="undefined"?"&join_id=":"&join_id="+params.join_id+"";
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseButtonevent',
		title: '工时分类',
		content: '<iframe id="listWorkHourFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 350,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//-------------------------------------------------人事管理end------------------------------------------------
/**
 * 时间对象的格式化;
 */
Date.prototype.format = function(format) {
    /*
     * eg:format="YYYY-MM-dd hh:mm:ss";
     */
    var o = {
        "M+" :this.getMonth() + 1, // month
        "d+" :this.getDate(), // day
        "h+" :this.getHours(), // hour
        "m+" :this.getMinutes(), // minute
        "s+" :this.getSeconds(), // second
        "q+" :Math.floor((this.getMonth() + 3) / 3), // quarter
        "S" :this.getMilliseconds()
    // millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
                .substr(4 - RegExp.$1.length));
    }

    for ( var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                    : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

//选择门店团购选择界面
function selectMendian(params){
	var basePath = params.basePath;
	var url = basePath+"/Actm/toChooseMendian.do";
	var callBack = params.callBack ? params.callBack : "setActm";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseActm',
		title: params.title ? params.title : '选择门店设置明细',
		content: '<iframe id="listActmFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}


//更多查询条件汇总
function moreCond(params) {
	var basePath = params.basePath;
	var firmdes = params.firmdes;
	var pk_store = params.pk_store;
	var bdat = params.bdat;
	var edat = params.edat;
	var url = params.url;
	var callBack = params.callBack ? params.callBack : "setMoreCond";
	var mdxzFlag = params.mdxzFlag;
	var rqxzFlag = params.rqxzFlag;
	var pcrqxzFlag = params.pcrqxzFlag;
	var sdxzFlag = params.sdxzFlag;
	var zcxzFlag = params.zcxzFlag;
	var cpxzFlag = params.cpxzFlag;
	var baseUrl = params.baseUrl;
	if (url == '') {
		url = basePath + "/customReport/moreConditions.do?pk_store=" + pk_store
				+ "&bdat=" + bdat + "&edat=" + edat + "&vname=" + firmdes
				+ "&mdxzFlag=" + mdxzFlag + "&rqxzFlag=" + rqxzFlag
				+ "&pcrqxzFlag=" + pcrqxzFlag + "&sdxzFlag=" + sdxzFlag
				+ "&zcxzFlag=" + zcxzFlag + "&cpxzFlag=" + cpxzFlag + "";
	} else {
		url = basePath + url + baseUrl;
	}
	url += ("&callBack=" + callBack);

	return $('body').window(
			{
				title : '更多查询条件',
				content : '<iframe id="queryModelFrame" frameborder="0" src="' + url
						+ '"></iframe>',
				width : '800px',
				height : '500px',
				draggable : true,
				isModal : true
			});
}


//选择集团部门
function selectGroupDept(params){
	var basePath = params.basePath;
	var url = basePath+"/groupDept/toChooseGroupDept.do";
	var callBack = params.callBack ? params.callBack : "setGroupDept";
	url += ("?callBack="+callBack);
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	if(params.single) url += '&single=true';
	//pk_id列表界面的集合，在列表界面将不会显示这些id的数据，以便数据不会重复选择
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseMarket',
		title: '选择集团部门',
		content: '<iframe id="listGroupDeptFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//菜品选择
function selectPubitemTree(params){
	var basePath = params.basePath;
	var url = basePath+"/pubitemNew/selectPubitemTree.do";
	var callBack = params.callBack ? params.callBack : "setPubitem";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += '&pk_id='+(params.pk_id ? params.pk_id :'');
	url += '&ver='+(params.ver ? params.ver :'1');
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseActm',
		title: params.title ? params.title : '选择菜品',
		content: '<iframe id="listpubitem" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}

//菜品组设置选择菜谱明细
function selectPubItemDetail(params){
	var basePath = params.basePath;
	var url = basePath+"/pubitemTeam/toChoosePubItem.do";
	var callBack = params.callBack ? params.callBack : "setPubItem";
	url += ("?callBack="+callBack);
	var isTc = params.isTc ? params.isTc : "0";
	url += ("&isTc="+isTc);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubItem',
		title: '选择菜谱明细',
		content: '<iframe id="listPubItemFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//菜品组设置选择适用帐号
function selectPubItemAccount(params){
	var basePath = params.basePath;
	var url = basePath+"/pubitemTeam/toChooseAccount.do";
	var callBack = params.callBack ? params.callBack : "setAccount";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseAccount',
		title: '选择帐号',
		content: '<iframe id="listAccountFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 450,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//选择菜品-BOH-新界面
function choosePubitem(params){
	var basePath = params.basePath;
	var url = basePath+"/pubitemTeam/selectPubitems.do";
	var callBack = params.callBack ? params.callBack : "setPubitem";
	url += ("?callBack="+callBack);
	var isTc = params.isTc ? params.isTc : "0";
	url += ("&isTc="+isTc);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	url += params.reportName ? '&reportName='+params.reportName : '&reportName=null';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_choosePubitem',
		title: params.title ? params.title : '选择菜品',
		content: '<iframe id="listPubitemFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 500,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}
//----------------------------BOH end-------------------------
//选择类别
function selectCouponWx(params){
	var basePath = params.basePath;
	var url = basePath + "/netGoods/selectCoupon.do";
	var callBack = params.callBack ? params.callBack : "setCoupon";
	url += ("?callBack="+callBack);
	if(params.single) url += '&single=true';
	url += params.domId ? '&domId='+params.domId : '&domId=selected';
	var data = params.param;
	for(var i in data){
		url += ('&'+i + '=' + data[i]);
	}
	return $('body').window({
		id: 'window_chooseCoupon',
		title: '选择电子券',
		content: '<iframe id="listCouponFrame" frameborder="0" src='+url+'></iframe>',
		width: params.width ? params.width : 400,
		height: params.height ? params.height : 500,
		confirmClose: false,
		draggable: true,
		isModal: true
	});
}