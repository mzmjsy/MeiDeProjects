(function($) {
	$.fn.window = function(options) {
		var windowId = '', DATA_NAME = 'lib-window', config = options || {};
		this.each(function() {
			var window = new lib.Window(config, $(this));
			windowId = window.getId();
			$(this).data(DATA_NAME + windowId, window);
		});
		return $(this).data(DATA_NAME + windowId);
	};
	var lib = lib || {};
	lib.Window = function(options, container) {
		$.extend(true, this, lib.Window.defaults, options, {
			'container' : container
		});
		this.id = this.getId();
		this._init();
	};
	lib.Window.defaults = {
		id : '',
		content : '',
		title : '',
		icon : null,
		position : {
			type : 'absolute',
			top : null,
			left : null
		},
		width : '500px',
		height : '400px',
		minimizable : true,
		maximizable : true,
		closable : true,
		confirmClose : true,
		isModal : false,
		draggable : false,
		topBar : null,
		bottomBar : null,
		container : $(document.body),
		handler : $.noop
	};
	lib.Window.AUTO_ID = 100;
	lib.Window.Z_INDEX = 100;
	lib.Window.prototype = {
		_init : function() {
			var self = this;
			var _winHtml = [];
			_winHtml.push('<div class="window" id="' + self.id + '">');
			_winHtml.push('  <div class="window-header">');
			_winHtml.push('   <div class="icon"></div>');
			_winHtml.push('   <div class="title"></div>');
			_winHtml.push('   <div class="operate">');
			_winHtml.push('    <div class="close"></div>');
			_winHtml.push('    <div class="max"></div>');
			_winHtml.push('    <div class="min"></div>');
			_winHtml.push('   </div>');
			_winHtml.push('  </div>');
			_winHtml.push('  <div class="window-body">');
			_winHtml.push('   <div class="window-topbar"></div>');
			_winHtml.push('   <div class="window-content"></div>');
			_winHtml.push('   <div class="window-bottombar"></div>');
			_winHtml.push('  </div>');
			_winHtml.push('</div>');
			var _doc = self._doc = $(_winHtml.join(''));
			self._doc.appendTo(self.container);
			var _window = self._window = $('#' + self.id);
			self._win_header = $('.window-header', _doc);
			self._win_icon = $('.icon', _doc);
			self._win_title = $('.title', _doc);
			self._win_operate = $('.operate', _doc);
			self._win_close = $('.close', _doc);
			self._win_max = $('.max', _doc);
			self._win_min = $('.min', _doc);
			self._win_body = $('.window-body', _doc);
			self._win_tbar = $('.window-topbar', _doc);
			self._win_content = $('.window-content', _doc);
			self._win_bbar = $('.window-bottombar', _doc);
			self._loadBackground();
			self._loadWindow();
		},
		_loadWindow : function() {
			var self = this;
			self.setHeight(self.height).setWidth(self.width);
			self.addIcon(self.icon);
			self.addTitle(self.title);
			self.addContent(self.content);
			self.addBar('top', self.topBar);
			self.addBar('bottom', self.bottomBar);
			var _tbarHgt = self.topBar ? self.topBar.getOuterHeight() : 0;
			var _bbarHgt = self.bottomBar ? self.bottomBar.getOuterHeight() : 0;
			self._win_content.height((self.getHeight()
					- self._win_header.outerHeight() - _tbarHgt - _bbarHgt - 1)
					+ 'px');
			self.position.top = parseInt(self.position.top)
					|| (self.container.height() - self.getOuterHeight()) * 0.5;
			self.position.left = parseInt(self.position.left)
					|| (self.container.width() - self.getOuterWidth()) * 0.5;
			self.setPosition(self.position);
			if (self.draggable) {
				self._win_header.css('cursor', 'move');
				self._window.draggable({
					containment : "parent"
				});
			}
			if (self.minimizable) {
				self._win_min.show();
				self._win_min.bind('click', {
					'scope' : self
				}, self.min);
			}
			if (self.maximizable) {
				self._win_max.show();
				self._win_max.bind('click', {
					'scope' : self
				}, self.max);
			}
			if (self.closable) {
				self._win_close.show();
				self._win_close.bind('click', {
					'scope' : self
				}, self.close);
			}
			self._window.bind('mousedown', {
				'scope' : self
			}, self.moveTop);
		},
		_loadBackground : function() {
			var self = this;
			if (self.isModal) {
				var modalDiv = $('.window-background').size() ? $('.window-background')
						: $('<div class="window-background" />');
				modalDiv.appendTo(self.container).fadeTo(500, 0.33);
			}
		},
		moveTop : function(e) {
			var self = e && e.data.scope || this, zIndex = self.container
					.data('zIndex')
					|| lib.Window.Z_INDEX;
			++zIndex;
			self._window.css('z-index', zIndex);
			self.container.data('zIndex', zIndex);
		},
		min : function(e) {
			var self = e && e.data.scope || this;
			self.setHeight(self.getHeight() - self._win_body.outerHeight());
			self.setWidth(160);
			self._window.css({
				'position' : 'absolute',
				'top' : self.container.height() - self.getOuterHeight()-28,
				'left' : 0
			});
			self._win_body.hide();
			self._win_title.width(90);
			self._win_min.removeClass('min').addClass('restore')
					.unbind('click').bind('click', {
						'scope' : self
					}, self.restore);
			self._win_max.removeClass().addClass('max').unbind('click').bind(
					'click', {
						'scope' : self
					}, self.max);
		},
		max : function(e) {
			var self = e && e.data.scope || this;
			self.setHeight(self.container.height() - 2 - 4);
			self.setWidth(self.container.width() - 2 - 4);
			self._window.css({
				'top' : 0,
				'left' : 0
			});
			if (self._win_body.is(':hidden'))
				self._win_body.show();
			self._win_title.width(self._win_header.width()
					- self._win_icon.outerWidth(true) - 45);
			var _tbarHgt = self.topBar ? self.topBar.getOuterHeight() : 0;
			var _bbarHgt = self.bottomBar ? self.bottomBar.getOuterHeight() : 0;
			self._win_content.height((self.getHeight()
					- self._win_header.outerHeight() - _tbarHgt - _bbarHgt - 1)
					+ 'px');
			self._win_max.removeClass('max').addClass('restore')
					.unbind('click').bind('click', {
						'scope' : self
					}, self.restore);
			self._win_min.removeClass().addClass('min').unbind('click').bind(
					'click', {
						'scope' : self
					}, self.min);
		},
		restore : function(e) {
			var self = e && e.data.scope || this;
			self.setHeight(self.height);
			self.setWidth(self.width);
			self.setPosition(self.position);
			if (self._win_body.is(':hidden'))
				self._win_body.show();
			self._win_title.width(self._win_header.width()
					- self._win_icon.outerWidth(true) - 45);
			var _tbarHgt = self.topBar ? self.topBar.getOuterHeight() : 0;
			var _bbarHgt = self.bottomBar ? self.bottomBar.getOuterHeight() : 0;
			self._win_content.height((self.getHeight()
					- self._win_header.outerHeight() - _tbarHgt - _bbarHgt - 1)
					+ 'px');
			self._win_min.removeClass().addClass('min').unbind('click').bind(
					'click', {
						'scope' : self
					}, self.min);
			self._win_max.removeClass().addClass('max').unbind('click').bind(
					'click', {
						'scope' : self
					}, self.max);
		},
		close : function(e) {
			var self = e && e.data.scope || this;
			if (!self.confirmClose || (self.confirmClose)) {
				if (self.isModal) {
					$('.window-background').hide();
				}
				if (self.afterCloseHandler) {
					self.afterCloseHandler.call(self, self);
				}
				self.destroy();
			}
		},
		close_enter : function(e) {
			var self = e && e.data.scope || this;
			if (!self.confirmClose || (self.confirmClose)) {
				if (self.isModal) {
					$('.window-background').hide();
				}
				if (self.afterCloseHandler) {
					self.afterCloseHandler.call(self, self);
				}
				self.destroy();
			}
		},
		addBar : function(position, bar) {
			var self = this;
			if (bar && $.isPlainObject(bar)) {
				switch (position) {
				case 'top':
					self._win_tbar.show();
					self.topBar = self._win_tbar.toolbar(bar);
					$("#" + self.topBar.getId(), self._win_tbar).css({
						'border-top' : '0px',
						'border-left' : '0px',
						'border-right' : '0px'
					});
					break;
				case 'bottom':
					self._win_bbar.show();
					self.bottomBar = self._win_bbar.toolbar(bar);
					$("#" + self.bottomBar.getId(), self._win_bbar).css({
						'border-bottom' : '0px',
						'border-left' : '0px',
						'border-right' : '0px'
					});
					break;
				}
			}
			return self;
		},
		addIcon : function(icon) {
			var self = this;
			if (icon) {
				if (icon.cls)
					self._win_icon.addClass(icon.cls);
				if (icon.url)
					self._win_icon.css('background', 'url(' + icon.url
							+ ') no-repeat center center');
			}
			return self;
		},
		addTitle : function(title) {
			var self = this;
			self._win_title.width(self._win_header.width()
					- self._win_icon.outerWidth(true) - 45);
			if (title) {
				self._win_title.html(title);
				self._win_title.attr('title', title);
			}
			return self;
		},
		addContent : function(content) {
			var self = this;
			if (content)
				self._win_content.html(content);
			return self;
		},
		getTopBar : function() {
			return this.topBar;
		},
		getBottomBar : function() {
			return this.bottomBar;
		},
		destroy : function() {
			this._window.remove();
		},
		getOuterHeight : function() {
			return this._window.outerHeight();
		},
		getOuterWidth : function() {
			return this._window.outerWidth();
		},
		getHeight : function() {
			return this._window.height();
		},
		getWidth : function() {
			return this._window.width();
		},
		setHeight : function(height) {
			this._window.css('height', typeof height === 'number' ? height
					+ 'px' : height);
			return this;
		},
		setWidth : function(width) {
			this._window.css('width', typeof width === 'number' ? width + 'px'
					: width);
			return this;
		},
		setPosition : function(position) {
			this._window.css({
				'position' : position.type ? position.type : 'absolute',
				'top' : typeof position.top === 'number' ? position.top + 'px'
						: position.top,
				'left' : typeof position.left === 'number' ? position.left
						+ 'px' : position.left
			});
			return this;
		},
		getContainer : function() {
			return this.container;
		},
		getId : function() {
			return this.id
					|| (this.id = 'autoId-window-' + (++lib.Window.AUTO_ID));
		}
	};
})(jQuery);