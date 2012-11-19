angular.module('ui.bootstrap.dialog', []).provider("$dialog", function(){

	var defaults = {
		backdrop: true,
		modalClass: 'modal',
		backdropClass: 'modal-backdrop',
		controller:null,
		locals:{},
		callback: null,
		backdropFade: false,
		modalFade:false,
		keyboard: true, // close with esc key
		backdropClick: true // only in conjunction with backdrop=true
	};

	var globalOptions = {};

	this.options = function(value){
		globalOptions = value;
	};

	this.$get = ["$document","$compile","$rootScope","$controller","$timeout", "$q", function ($document,  $compile,  $rootScope,  $controller,  $timeout, $q) {

		var body = $document.find('body');

		var createElement = function(clazz, fade){
			var el = angular.element("<div>");
			el.addClass(clazz);
			if(fade){
				el.addClass('fade');
				el.removeClass('in'); // just to be sure
			}
			return el;
		};

		var applyLocals = function(scope, locals){
			for(var prop in locals) {
				if(locals.hasOwnProperty(prop)){
					scope[prop] = locals[prop];
				}
			}
		};

		var Dialog = function(template, opts){
			var options = this.options = angular.extend({}, defaults, globalOptions, opts);
			options.scope = options.scope || $rootScope.$new();
			options.scope.dialog = this;

			applyLocals(options.scope, options.locals);

			var backdropEl = createElement(options.backdropClass, options.backdropFade);
			var modalEl = createElement(options.modalClass, options.modalFade);
			modalEl.attr("ng-include", "'" + template + "'");
			if(options.controller){
				modalEl.attr("ng-controller", options.controller);
			}

			var handledEscapeKey = function(e){
				if (e.keyCode === 27) {
					options.scope.dialog.close();
					e.preventDefault();
				}
			};

			var handleBackDropClick = function(e){
				options.scope.dialog.close();
				e.preventDefault();
			};

			var bindEvents = function(){
				if(options.keyboard){
					body.bind('keydown', handledEscapeKey);
				}
				if(options.backdrop && options.backdropClick){
					backdropEl.bind('click', handleBackDropClick);
				}
			};

			var unbindEvents = function(){
				if(options.keyboard){
					body.unbind('keydown', handledEscapeKey);
				}
				if(options.backdrop && options.backdropClick){
					backdropEl.unbind('click', handleBackDropClick);
				}
			};

			promiseCallbacks = {};

			var thiz = this;

			var createCallback = function(name){
				thiz[name] = function(fn){
					promiseCallbacks[name] = fn;
					return this;
				};
			};

			var onCloseComplete = function(result){
				modalEl.remove();
				if(options.backdrop) {
					backdropEl.remove();
				}
				open = false;
				unbindEvents();

				if(options.callback) { options.callback(result); }
				
				if(promiseCallbacks[result]) {
					promiseCallbacks[result](result);
				}
				if(promiseCallbacks['closed']){
					promiseCallbacks['closed'](result);
				}
			};

			// add promise method for each button
			if(options.locals.buttons){
				for(var i = 0;i < options.locals.buttons.length; i++){
					createCallback(options.locals.buttons[i].result);
				}
			}

			createCallback('closed');
			var open = false;
			this.isOpen = function() { return open; };

			this.close = function(result){
				var transitionHandler = function(e){
					modalEl.unbind(angularUI.getTransitionEndEventName(), transitionHandler);
					onCloseComplete(result);
				};

				modalEl.bind(angularUI.getTransitionEndEventName(), transitionHandler);
				
				if(options.modalFade){
					modalEl.removeClass('in');

					if(options.backdropFade){
						backdropEl.removeClass('in');
					}
					return;
				}

				onCloseComplete(result);
			};

			this.open = function(){
				
				if(options.backdrop) {
					body.append(backdropEl);
				}
				body.append($compile(modalEl)(this.options.scope));
				open = true;
				$timeout(function(){
					if(options.modalFade){
						modalEl.addClass('in');
					}
					if(options.backdropFade){
						backdropEl.addClass('in');
					}
				},1);

				bindEvents();
			};
		};

		// This version returns a SERVICE that allows you to open dialogs specifying a template and optional options. The 
		// open method returns an object that represents the dialog and allows, closing it (and opening it again)

		// Another option would be returning a CONSTRUCTOR that creates a dialog, but does not show it immediately. 

		// I'm leaning towards the first option:
		//	- it does not manipulate the DOM unless it has to, this could be done with the .ctor version as well, 
		//	but that feels a bit awkward, I think
		//	- The injected $dialog could also support Prompt, Alert, etc. which makes it defintely a service.
		
		// ze $dialog servize
		return {
			message: function(title, message, buttons, opts){
				if(!title) {
					throw new Error('title is required');
				}
				if(!message) {
					throw new Error('message is required');
				}
				if(!buttons) {
					throw new Error('buttons is required');
				}
				var options = angular.extend({}, opts, {
					locals: {
						title:title,
						message:message,
						buttons:buttons // [{label:, cssClass:, result:}]
					}
				});
				
				return this.open('template/dialog/message.html', options);
			},
			open: function(template, opts){
				if(!template) {
					throw new Error('template is required');
				}
				var dlg = new Dialog(template, opts);
				dlg.open();
				return dlg;
			}
		};
	}];
});