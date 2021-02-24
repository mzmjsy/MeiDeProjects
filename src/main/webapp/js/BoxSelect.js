$(function(){
     //全选
     $("#chkAll").click(function(){
			//所有checkbox跟着全选的checkbox走。
			$('[name=idList]:checkbox').attr("checked", this.checked );
	 });
	 $('[name=idList]:checkbox').click(function(){
				//定义一个临时变量，避免重复使用同一个选择器选择页面中的元素，提升程序效率。
				var $tmp=$('[name=idList]:checkbox');
				//用filter方法筛选出选中的复选框。并直接给chkAll赋值。
				$('#chkAll').attr('checked',$tmp.length==$tmp.filter(':checked').length);

			/*
				//一行做过多的事情需要写更多注释。复杂选择器还可能影响效率。因此不推荐如下写法。
				$('#chkAll').attr('checked',!$('[name=idList]:checkbox').filter(':not(:checked)').length);
			*/
	 });
	  //输出值
	$("#send").click(function(){
		var str="你选中的是：\r";
		$('[name=idList]:checkbox:checked').each(function(){
			str+=$(this).val()+"\r";
		});
		alert(str);
	});
	
	//类别定义用
	//全选2
    $("#chkAll2").click(function(){
			$('[name=idList2]:checkbox').attr("checked", this.checked );
	 });
	 $('[name=idList2]:checkbox').click(function(){
				var $tmp=$('[name=idList2]:checkbox');
				$('#chkAll2').attr('checked',$tmp.length==$tmp.filter(':checked').length);
	 });
	//全选3
	 $("#chkAll3").click(function(){
			$('[name=idList3]:checkbox').attr("checked", this.checked );
	 });
	 $('[name=idList3]:checkbox').click(function(){
				var $tmp=$('[name=idList3]:checkbox');
				$('#chkAll3').attr('checked',$tmp.length==$tmp.filter(':checked').length);
	 });
	//全选4-mmw
	 $("#chkAll4").click(function(){
		 var bol=this.checked;
		 $(".table-body").find('tbody').find('tr').each(function(){
			 var one=$(this).css("display");
			 if(one=="block" || one=="table-row"){//如果值等于显示：block则进入全选方法
				 $(this).find('input').attr("checked", bol );
			 }
		 });
	});
	 $('[name=idList4]:checkbox').click(function(){
		 var $tmp = $(".table-body").find('tbody').find('tr');
		 var selecttr=0;//可见行中选中行
		 var totaltr=0;//可见行
		 
		 $tmp.each(function(){
			 var one=$(this).css("display");
			//如果值等于显示：block则进入全选方法
			 if(one=="block" || one=="table-row"){
				 if($(this).find('input').attr("checked")){
					 selecttr++;
				 }
				 totaltr++;
			 };
		 });
		
		 $('#chkAll4').attr('checked',selecttr==totaltr);
	 });
});