var onSelect=$('<div id="wait2" style="display:none;"><input type="hidden" id="wait2" value=""/></div> <div id="wait" style="display:none;"><img src="../image/loading_detail.gif" />&nbsp;<span style="color:white;font-size:15px;">数据加载中...</span></div>');
//重写toFixed方法
Number.prototype.toFixed = function(s){
	//没有对fractionDigits做任何处理，假设它是合法输入
	//alert("=======");
	var r = String(this).split(".");
	var result = '';
	if(r.length == 1){
		if(s){
			result = r[0]+'.';
			for(var i = 0 ; i < s ; i ++){
				result = result + '0';
			}
		}else{
			result = r[0].toString();
		}
	}else{
		var zero = [];
		if(s){
			var decimal = Number('0.'+r[1]);
			var dec = Math.round(decimal * Math.pow(10,s));
			dec = String(dec);
			if(dec.length == s+1 && dec.indexOf(".")<0){
				result = (Number(r[0]) + 1) + "." + dec.substr(1);
			}else{
				dec = String(Number(dec)/Math.pow(10,s));
				dec = dec.indexOf(".") >= 0 ? dec.split(".")[1] : dec ;
				var n = s - dec.length;
				for(var i = 0 ; i < n ; i ++)zero.push(0);
				result = r[0] + "." + dec + zero.join('');
			}
		}else{
			result = Math.round(this).toString();
		}
	}
    return result;
};
//处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
$(document).ready(function(){
onSelect.appendTo($('body'));
	$(document).bind('keypress keydown',function(e){
		var doPrevent; 
		if (e.keyCode == 8) { 
		var d = e.srcElement || e.target; 
		if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') { 
			doPrevent = d.readOnly || d.disabled; 
		}else  doPrevent = true; 
		}else  doPrevent = false; 
		if (doPrevent) 
		    e.preventDefault(); 
	}); 
});
function loadGrid(){
	var $grid = $('.grid'), 
	$thead = $('.table-head',$grid),
	$tbody = $('.table-body',$grid),
	docWidth = $(document.body).width(),
	headWidth = $thead.find('table').outerWidth(),
	bodyWidth = $tbody.find('table').outerWidth(),
	headWidth = (headWidth > docWidth || headWidth + 17 > docWidth)
		? headWidth + 17 
		: docWidth,
	bodyWidth = (bodyWidth > docWidth || bodyWidth + 17 > docWidth)
		? bodyWidth + 17 
		: docWidth;

	$thead.width(headWidth);
	$tbody.width(bodyWidth);
	
	if(headWidth > docWidth){
		$grid.width(docWidth).css('overflow-x','auto');
		$tbody.height($tbody.height() - 17);
		$thead.width($tbody.width());
	}else{
		$grid.width(docWidth).css('overflow-x','hidden');		
	}
}

/**
 * 序列化对象的信息(ajax传递json对象的时候，需要将信息组合成标准的json对象的格式)
 */
$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [ o[this.name] ];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};


/**获得Frame*/
function getFrame(frameId)
{
//  if($.browser.mozilla) {
    return document.getElementById(frameId).contentWindow;
//  } else {
//    return window.frames[frameId];
//  }
}

/** 提交iframe中的form */
function submitFrameForm(frameId, formId){
//  if ($.browser.mozilla) {
    document.getElementById(frameId).contentWindow.document.forms[formId].submit();
//  } else {
//    window.frames[frameId].document.forms[formId].submit();
//  }
}

/**
 * 动态设置元素的高度
 */
function setElementHeight(ele, array, wrap, fixHeight){
  if(!fixHeight)
    fixHeight = 0;
  wrap = wrap || document.body;
  for(var i=0; i<array.length; i++)
  {
    fixHeight += $(array[i]).outerHeight();
  }
  $(ele).height($(wrap).height() - fixHeight);
}

/**
 * 获取第一个多选按钮的值,  改成    是否单选判断
 */
function getFirstID(){
	var chkValue,
		checkboxList = $('.grid').find('.table-body').find(':checkbox');
	
	if(checkboxList 
		&& checkboxList.filter(':checked').size() == 1){
		
		chkValue = checkboxList.filter(':checked').eq(0).val();
	}else{
		return false;
	}
	
	return chkValue;
}

/**
 * 获取多选按钮所有选中的值
 */
function getAllID(){
	var chkArray = [],
		checkboxList = $('.grid').find('.table-body').find(':checkbox');
	
	if(checkboxList 
		&& checkboxList.filter(':checked').size() > 0){
		
		checkboxList.filter(':checked').each(function(){
			chkArray.push($(this).val());
		});
		
	}
	
	return chkArray.join();
}

function showMessage(config){
	var option = {
		type: 'success', //只能接受：'success'或者'error'
		msg:'操作成功！',
		speed:1500,
		handler: $.noop
	};
	
	$.extend(option,config);
	
	//如果没有提示信息层，则需要创建并追加到页面的body中。
	if($('.bgDiv',document.body).length === 0
		||$('.bgDiv',document.body).length === 0){
		
		var _html = [];
		_html.push('<div class="bgDiv"></div>');
		_html.push('<div class="message"></div>');
		
		var _doc = $(_html.join(''));
		
		$(document.body).append(_doc);
	}
	
	//获取提示信息层
	var $bgDiv = $('.bgDiv',document.body),
		$messageDiv = $('.message',document.body);
	
	$messageDiv.removeClass('success error');
	$messageDiv.addClass(option.type);
	$messageDiv.text(option.msg);
	
	//隐藏提示信息层
	if($bgDiv.is(':visible'))
		$bgDiv.hide();
	if($messageDiv.is(':visible'))
		$messageDiv.hide();
	
	//使提示信息在页面的中间显示
	var top = ($bgDiv.height() - $messageDiv.outerHeight()) * 0.5;
	var left = ($bgDiv.width() - $messageDiv.outerWidth()) * 0.5;
	
	//显示提示信息层
	$bgDiv.fadeTo('fast',0.33,function(){
		$messageDiv.css({
			'top': top+'px',
			'left': left+'px'
		}).show();
	});
	
	//关闭提示信息
	window.setTimeout(function(){
		$bgDiv.hide();
		$messageDiv.hide();
		option['handler']();
	}, option.speed);
}
//Chrome click 
function invokeClick(element) {
		if(element.click)element.click(); //判断是否支持click() 事件
		else if(element.fireEvent)element.fireEvent('onclick'); //触发click() 事件
		else if(document.createEvent){
		var evt = document.createEvent("MouseEvents"); //创建click() 事件
		evt.initEvent("click", true, true); //初始化click() 事件
		element.dispatchEvent(evt); //分发click() 事件
		}
}
	//数据加载
	$("#listForm").submit( function (){
		if($("#wait2").val()!='NO'){
			$("#wait2").css('display','block');
			$("#wait").css('display','block');
		}
		setTimeout("waitHide()",30000);
	});
	//数据加载消失
	function waitHide(){
		$("#wait2").css('display','none');
		$("#wait").css('display','none');
	}
	//双击打开新标签（汇总->明细）
	function openTag(moduleId,moduleName,moduleUrl,parameters){
//		top.tabMain.close('#tab_'+moduleId);
		$(window.parent.parent.document).find('.main').find('.tab-item').find('#tab_'+moduleId).find('.button-arrow').click();
		top.tabMain.addItem([{
			id: 'tab_'+moduleId,
			text: moduleName,
			title: moduleName,
			closable: true,
			content: '<iframe id="iframe_'+moduleId+'" name="iframe_'+moduleId+'" frameborder="0" src="about:blank"></iframe>'
		}
		]);
		var form =$('<form method="POST" action='+moduleUrl+' target="iframe_'+moduleId+'" name="'+moduleId+'" id="'+moduleId+'"></form>');
		for(var param in parameters){
			var input = $('<input name ="'+param+'" value="'+parameters[param]+'"></input>');
			form.append(input);
		}
		form.appendTo($("body",top.window.document));
 		top.tabMain.show('tab_'+moduleId);
		form.submit();
		form.remove();
	}
	//日期格式化(YYYY-MM-DD)
	function convertDate(time){
		if(!$.trim(time)) return "";
		var date=new Date(time); 
		var str="";     
		str+=date.getFullYear()+"-";     
		str+=((date.getMonth()+1)<10?"0"+(date.getMonth()+1):(date.getMonth()+1))+"-";     
		str+=date.getDate()<10?"0"+date.getDate():date.getDate();
		return str;
	}
	
	function showHelps(helpId){
		$('body').window({
			id: 'window_help',
			title: '帮助',
			content: '<iframe id="HelpsFrame" frameborder="0" src="'+helpId+'"></iframe>',
			width: '750px',
			height: '480px',
			draggable: true,
			isModal: true});
	}
	//查找form-label下的文字然后为本身添加title属性用于鼠标移入展示
	$(function(){
		var labels = $('.form-line .form-label');
		$.each(labels,function(i,label){
			$(this).attr('title',$.trim($(this).text()));
		});
	});
	
	//验证该数据是否被引用,tablename:引用的表，field:引用的字段，value:被引用的值
	function checkQuote(vpath,tablename,field,value,enablestate,querysql){
		$.ajaxSetup({ 
			  async: false 
	  	});
		var returnvalue = 0;
		var data = {};
		data["vcode"] = value;
		data["vcodename"] = field;
		data["vtablename"] = tablename;
		data["enablestate"] = enablestate;
		data["querysql"] = querysql;
		$.post(vpath + "/commonMethod/checkQuote.do",data,function(returndata){
			if (returndata != null && returndata > 0) {
				returnvalue = 1;
			} else if (returndata != null && returndata == "error") {
				returnvalue = -1;
			} else {
				returnvalue = 0;
			}
		});
		return returnvalue;
	}
	
	//总部SCM 选择仓位方法
	function chooseStoreSCM(params){  
		var basePath = params.basePath;
		var url = basePath+"/positn/searchAllPositn.do";
		var callBack = params.callBack ? params.callBack : "";
		url += ("?callBack="+callBack);
		if(params.single) url += '&single=true';
		url += params.firmId ? '&code='+params.firmId : '&code=';//仓位编码
		url += params.tagName ? '&tagName='+params.tagName : '&tagName=';//标签name属性值
		url += params.tagId ? '&tagId='+params.tagId : '&tagId=';//表情id属性值
		url += params.typn ? '&typn='+params.typn : '&typn=';//仓位类型
		url += '&pk_id='+(params.pk_id ? params.pk_id :'');
		url += '&ver='+(params.ver ? params.ver :'1');
		url += '&admin='+(params.admin ? params.admin :'');
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
			title: params.title ? params.title : '选择仓位',
					content: '<iframe id="listStoreFrame" frameborder="0" src='+url+'></iframe>',
					width: params.width ? params.width : 500,
							height: params.height ? params.height : 500,
									confirmClose: false,
									draggable: true,
									isModal: true
		});
	}
	
	function checkMultiCodeQuote(vpath,tablename,field,value,enablestate){
		$.ajaxSetup({ 
			  async: false 
	  	});
		var returnvalue = 0;
		var data = {};
		data["vcode"] = value;
		data["vcodename"] = field;
		data["vtablename"] = tablename;
		data["enablestate"] = enablestate;
		$.post(vpath + "/commonMethod/checkMultiCodeQuote.do",data,function(returndata){
			if (returndata != null && returndata > 0) {
				returnvalue = 1;
			} else if (returndata != null && returndata == "error") {
				returnvalue = -1;
			} else {
				returnvalue = 0;
			}
		});
		return returnvalue;
	}
top.$(document.body).keypress(function(event){
	if(event.keyCode==27 || event.keyCode==13 || event.keyCode==32){
			 closemsgwin();
	 }
});
var messagewin;
function alertconfirm(msg,yes,no){
	showmask();
	var windiv = '<div id="messagewin" class="messagewin"><div class="messagetitlewin"><span>确认信息</span></div><div class="messageinfowin"><span>'+msg+'</span></div><div class="messagebtnwin"><div id="confirmbtn" class="confirmbtn" >确定</div><div id="cancelbtn" class="cancelbtn" >取消</div></div></div>';
	if(top.$("#messagewin").length!=0){
		top.$("#messagewin").remove();
	}
	messagewin = $(windiv);
	messagewin.appendTo(top.$("#contentDiv"));
	var w = ($(window.parent.document.body).find("#contentDiv").length==0?$(window.parent.document.body).width()/2:$(document.body).width()/2)-200;
	var h = ($(window.parent.document.body).find("#contentDiv").length==0?$(window.parent.document.body).height()/2:$(document.body).height()/2)-200;
	messagewin.css('margin-left',w);
	messagewin.css('margin-top',h);
	top.$("#confirmbtn").bind('click',function(){
		closemsgwin();
		yes(true);
	});
	top.$("#cancelbtn").bind('click',function(){
		closemsgwin();
		no(true);
	});
}
function alerttips(msg){
	showmask();
	var windiv = '<div id="messagewin" class="messagewin"><div class="messagetitlewin"><span>提示信息</span></div><div class="messageinfowin"><span>'+msg+'</span></div><div class="messagebtnwin"><div class="okbtn" onclick="closemsgwin()">确&nbsp;定</div></div></div>';
	if(top.$("#messagewin").length!=0){
		top.$("#messagewin").remove();
	}
	messagewin = $(windiv);
	messagewin.appendTo(top.$("#contentDiv"));
	var w = ($(window.parent.document.body).find("#contentDiv").length==0?$(window.parent.document.body).width()/2:$(document.body).width()/2)-200;
	var h = ($(window.parent.document.body).find("#contentDiv").length==0?$(window.parent.document.body).height()/2:$(document.body).height()/2)-200;
	messagewin.css('margin-left',w);
	messagewin.css('margin-top',h);
}
function alerterror(msg){
	showmask();
	var windiv = '<div id="messagewin" class="messagewin"><div class="messagetitlewin"><span>提示信息</span></div><div class="messageinfowin"><span>'+msg+'</span></div><div class="messagebtnwin"><div class="okbtn" id="okbtn" onclick="closemsgwin()">确&nbsp;定</div></div></div>';
	if(top.$("#messagewin").length!=0){
		top.$("#messagewin").remove();
	}
	messagewin = $(windiv);
	messagewin.appendTo(top.$("#contentDiv"));
	var w = ($(window.parent.document.body).find("#contentDiv").length==0?$(window.parent.document.body).width()/2:$(document.body).width()/2)-200;
	var h = ($(window.parent.document.body).find("#contentDiv").length==0?$(window.parent.document.body).height()/2:$(document.body).height()/2)-200;
	messagewin.css('margin-left',w);
	messagewin.css('margin-top',h);
	top.$("#contentDiv").find('#showflag').val("1");
	$(document.body).unbind('keypress');
	top.$("#okbtn").live('click',function(){
		closemsgwin();
	});
}
function closemsgwin(){
	top.$("#contentDiv").find('#showflag').val("0");
	top.$("#messagewin").hide();
	top.$("#messagewin").remove();
	closemask();
}
function showmask(){
	top.$("#wait2").show();
	top.$("#contentDiv").show();
}
function closemask(){
	top.$("#wait2").hide();
	top.$("#contentDiv").hide();
}

/**
 * 描述：提成方案新增、修改时提示页面
 * 作者：马振
 * 时间：2016年4月25日下午8:44:37
 * @param msg
 */
function tishi(msg){
	showmask();
	var windiv = '<div id="messagewin" class="messagewin" style="width:500px;"><div class="messagetitlewin" style="width:500px;"><span>提示信息</span></div><div class="messageinfowin" style="padding-top:0px;"><span style="text-align:left; width:500px; height:160px;">'+msg+'</span></div><div class="messagebtnwin" style="width:500px;"><div class="okbtn" id="okbtn" onclick="closemsgwin()" style="width:500px;">确&nbsp;定</div></div></div>';
	if(top.$("#messagewin").length!=0){
		top.$("#messagewin").remove();
	}
	messagewin = $(windiv);
	messagewin.appendTo(top.$("#contentDiv"));
	var width = window.screen.width/2 - 200;	//屏幕分辨率的宽度/2 - 200
	var height = window.screen.height/2 - 300; //屏幕分辨率的高度/2 - 300
	messagewin.css('margin-left',width);
	messagewin.css('margin-top',height);
	top.$("#contentDiv").find('#showflag').val("1");
	$(document.body).unbind('keypress');
	top.$("#okbtn").live('click',function(){
		closemsgwin();
	});
}