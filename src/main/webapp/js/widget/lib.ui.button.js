/*
* @fileOverview button Javascript Component v1.0
*
* Dual licensed under the MIT or GPL Version 2 licenses.
*
* Build on jQuery JavaScript Library v1.5.1
* Date: 2011.07.19
* 
* all CSS sizing (width,height) is done in pixels (px)
*
*/
(function($){

	/**
	 * 给jQuery添加类实例方法：button
	 */
	$.fn.button = function(options){
		var buttonId = '',
			DATA_NAME = 'lib-button',
			config = options || {};

		this.each(function(){

			//创建button对象
			var button = new lib.Button(config,$(this));
			buttonId = button.getId();

			//设置button对象的缓存
			$(this).data(DATA_NAME + buttonId,button);

		});

		//返回缓存的button对象
		return $(this).data(DATA_NAME + buttonId);
	};

	//定义命名空间
	var lib = lib || {};
		
	/**
	 * 按钮（Button）类
	 */
	lib.Button = function(options,container){
		$.extend(true,this,lib.Button.defaults,options,{'container':container});

		//按钮的唯一标识
		this.id = this.getId();		

		//初始化按钮
		this._init();
	};

	/**
	 * 按钮的默认属性
	 */
	lib.Button.defaults = {
		/**
		 * 按钮的唯一标识
		 * @type {string}
		 */
		id: '',

		/**
		 * 按钮内容
		 * @type {string | html}
		 */
		text: '',

		/**
		 * 提示信息
		 */
		title: '',

		/**
		 * 按钮点击时，是否保留点击后的样式
		 */
		enableToggle: false,
		
		/**
		 * 按钮是否可用
		 */
		useable: true,

		/**
		 * 按钮的大小
		 */
		scale: 'small',	//可以是'small','medium','large'

		/**
		 * 按钮显示的位置
		 * @type {Object}
		 */
		position: {
			type: 'absolute',
			top: '0px',	//可以是数字、字符串，与css中的top属性相同。
			left: '0px'	//可以是数字、字符串，与css中的left属性相同。
		},

		/**
		 * 按钮显示的图标
		 * @type {Object}
		 *
		 *	注意：如果同时设置了cls属性和url属性，那么url会覆盖cls。
		 */
		icon: {
			cls: '',
			url: '',
			align: 'left',	//可以是'left','right','bottom','top'
			position: ['center','center'] //图标的位置
		},

		/**
		 * 按钮显示的箭头
		 * @type {Object}
		 *
		 */
		arrow: {
			cls: '',
			url: '',
			align: 'right',	//可以是'right','bottom'
			position: ['center','center'] //箭头图片的位置
		},

		/**
		 * 承载按钮的容器
		 * @type {jQuery Object}
		 */
		container: $(document.body),

		/**
		 * 按钮的事件
		 * @type {function}
		 */
		handler: $.noop
		
	};

	lib.Button.AUTO_ID = 100;

	lib.Button.prototype = {
		/**
		 * private
		 *
		 * 初始化按钮
		 *
		 */
		_init: function(){
			var self = this;

			var _btnHtml = [];
			_btnHtml.push('<div class="button '+self.title+'" id="' + self.id + '">');
			_btnHtml.push('		<div class="button-main">');
//		 	_btnHtml.push('			<div class="button-icon"></div>');
			_btnHtml.push('			<div class="button-content"></div>');
			_btnHtml.push('		</div>');
			_btnHtml.push('		<div class="button-arrow"></div>');
			_btnHtml.push('</div>');

			var _doc = self._doc = $(_btnHtml.join(''));
			self._doc.appendTo(self.container);

			var _button = self._button = $('#' + self.id);
			self._btn_main = $('.button-main',_doc);
			self._btn_icon = $('.button-icon',_doc);
			self._btn_content = $('.button-content',_doc);
			self._btn_arrow = $('.button-arrow',_doc);

			//加载按钮内容
			self._loadButton();

			//设置按钮样式
			self._renderButton();

		},

		/**
		 * private
		 *
		 * 加载按钮
		 *
		 */
		_loadButton: function(){
			var self = this,
				_icon = self.icon,
				_arrow = self.arrow;

			//由于在设置图片的样式时，给图片的容器加入了padding，数值为“1px”，所以，整体的高度都加了“2px”。
			//['20px','20px']表示：width='20px',height='20px'
			var	_area = {
					'small': ['20px','20px'],
					'medium': ['26px','26px'],
					'large': ['34px','34px']
				};

			var _width = _area[self.scale][0],
				_height = _area[self.scale][1];

			//设置按钮的位置
			self.setPosition(self.position);			

			//设置按钮的提示信息
			if(self.title){
				self._btn_main.attr('title',self.title);
			}

			//设置按钮的文字
			if(self.text){
				self._btn_content.html(self.text);

				self._btn_content.css({
					'height': _height,
					'line-height': _height
				});

			} else {
				self._btn_content.css({
					'width': '0px',
					'padding': '0px 0px'
				});
				self._btn_content.hide();
			}

			//设置按钮的图标
			if(_icon.cls || _icon.url){
				self._btn_icon.addClass(self.scale);
				if(_icon.cls){
					self._btn_icon.addClass(_icon.cls);
				}
				if(_icon.url){
					self._btn_icon.css('background', 'url(' + _icon.url + ') no-repeat ' + _icon.position.join(" "));
				}
			} else {
				self._btn_icon.css({
					'width': '0px',
					'padding': '0px 0px'
				});
				self._btn_icon.hide();
			}

			if(_icon.align === 'left' || _icon.align === 'right'){

				//设置"div[.button-main]"宽度，否则，"div[.button-icon]"和"div[.button-content]"
				//这两个div设置成右浮动时（float:right），会将整个button容器撑开
				self._btn_main.css({
					'width': (self._btn_icon.outerWidth() + self._btn_content.outerWidth()) + 'px'
				});
				self._btn_icon.addClass(_icon.align);
				self._btn_content.addClass(_icon.align);
			} else if(_icon.align === 'top'){

				//需要重新设置"div[.button-icon]"的宽度,否则，图标无法横向居中对齐
				self._btn_icon.css('width', self._btn_content.outerWidth() ? self._btn_content.outerWidth()+'px' : _width);
			} else if(_icon.align === 'bottom'){
				if(self._btn_content.is(':visible')){
					self._btn_icon.css('top', _height);
					self._btn_content.css('top', '-'+_height);
				}
				self._btn_icon.css('width', self._btn_content.outerWidth() ? self._btn_content.outerWidth()+'px' : _width);
			}

			//设置整个按钮div[.button]的宽度和高度
			self.setHeight(self._btn_main.outerHeight());
			self.setWidth(self._btn_main.outerWidth());
			
			//设置按钮的箭头
			if(_arrow.cls || _arrow.url){
				if(_arrow.cls){
					self._btn_arrow.addClass(_arrow.cls);
				}
				if(_arrow.url){
					self._btn_arrow.css('background', 'url(' + _arrow.url + ') no-repeat ' + _arrow.position.join(" "));
				}

				switch(_arrow.align){
					case 'right':
						self._btn_arrow.css({
							'width': '10px',
							'height': self._btn_main.outerHeight() ? self._btn_main.outerHeight()+'px' : _height
						});

						//设置整个按钮div[.button]的宽度(因为div[.button-arrow]设置成右浮动时（float:right），会将整个容器撑开)
						self.setWidth((self._btn_main.outerWidth() + self._btn_arrow.outerWidth()) + 'px');
						self.setHeight(self._btn_arrow.outerHeight() + 'px');
						break;
					case 'bottom':
						self._btn_arrow.before('<div style="clear:both;"></div>');
						self._btn_arrow.css({
							'width': self._btn_main.outerWidth() ? self._btn_main.outerWidth()+'px' : _width,
							'height': '10px'
						});
						
						//设置整个按钮div[.button]的宽度(因为div[.button-arrow]设置成右浮动时（float:right），会将整个容器撑开)
						self.setWidth(self._btn_arrow.outerWidth() + 'px');
						self.setHeight((self._btn_main.outerHeight() + self._btn_arrow.outerHeight()) + 'px');
						break;
				};
			} else {
				self._btn_arrow.hide();
			}
			
			if(!self.useable)
				self._btn_content.css('color','#808080');

		},

		/**
		 *	private
		 *
		 *	设置按钮样式
		 *
		 */
		_renderButton: function(){
			var self = this;

			if(self.useable){
				//鼠标移入、移出的样式
				self._button.hover(
					function(){
						$(this).addClass('button-over');
					},
					function(){
						$(this).removeClass('button-over');
					}	
				);
				
				//鼠标点击的样式
				self.setToggle(self.enableToggle);
			
				//绑定按钮事件
				self._button.bind('click',function(){
					self.handler.call(self,self);
				});
			}else{
				self._button.unbind('');
			}
			
		},

		destroy: function(){
			this._button.remove();
		},

		/**
		 *	public
		 *
		 *	获取按钮的高度（包括按钮的内边距和边框）
		 *
		 *	@return {number}
		 */
		getOuterHeight: function(){
			return this._button.outerHeight();
		},

		/**
		 *	public
		 *
		 *	获取按钮的宽度（包括按钮的内边距和边框）
		 *
		 *	@return {number}
		 */
		getOuterWidth: function(){
			return this._button.outerWidth();
		},

		/**
		 *	public
		 *
		 *	获取按钮的高度
		 *
		 *	@return {number}
		 */
		getHeight: function(){
			return this._button.height();
		},

		/**
		 *	public
		 *
		 *	获取按钮的宽度
		 *
		 *	@return {number}
		 */
		getWidth: function(){
			return this._button.width();
		},

		/**
		 *	public
		 *
		 *	设置按钮的高度
		 *
		 *	@param height {number | string}
		 *
		 *	@return {lib.ui.button}
		 */
		setHeight: function(height){
			this._button.css('height',typeof height === 'number' ? height+'px' : height);
			return this;
		},

		/**
		 *	public
		 *
		 *	设置按钮的宽度
		 *
		 *	@param width {number | string}
		 *
		 *	@return {lib.ui.button}
		 */
		setWidth: function(width){
			this._button.css('width',typeof width === 'number' ? width+'px' : width);
			return this;
		},

		/**
		 *	public
		 *
		 *	设置按钮的位置
		 *
		 *	@param position {object}
		 *
		 *	@return {lib.ui.button}
		 */
		setPosition: function(position){
			//设置按钮的位置
			this._button.css({
				'position': position.type ? position.type : 'absolute',
				'top': typeof position.top === 'number' ? position.top+'px' : position.top,
				'left': typeof position.left === 'number' ? position.left+'px' : position.left
			});
			return this;
		},
		
		/**
		 *	public
		 *
		 *	设置按钮鼠标点击的样式
		 *
		 *	@param enableToggle {boolean}
		 *
		 *	@return {lib.ui.button}
		 */
		setToggle: function(enableToggle){
			var self = this;
			self._button.unbind('click.button mousedown.button mouseup.button');
			
			if(enableToggle){
				self._button.bind('click.button',function(){
					$(this).toggleClass('button-click');
					self._btn_main.toggleClass('button-position');
				});
			}else{
				self._button
				.bind('mousedown.button',function(){
					$(this).addClass('button-click');
					self._btn_main.addClass('button-position');
				});

				self._button
				.bind('mouseup.button',function(){
					$(this).removeClass('button-click');
					self._btn_main.removeClass('button-position');
				});
			}
			return this;
		},

		/**
		 * public
		 *
		 * 获得按钮的容器
		 *
		 * @return {jQuery Object}
		 *
		 */
		getContainer: function () {
			return this.container;
		},

		/**
		 *	public
		 *
		 * 获得按钮的唯一标识（id）
		 *
		 * @return {string}
		 *
		 */
		getId: function () {
			return this.id || (this.id = 'autoId-button-' + (++lib.Button.AUTO_ID));
		}

	};

})(jQuery);