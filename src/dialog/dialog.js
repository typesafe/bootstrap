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

	this.$get = ["$document","$compile","$rootScope","$controller","$timeout", function ($document,  $compile,  $rootScope,  $controller,  $timeout) {

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

			var handledExcapeKey = function(e){
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
					body.bind('keydown', handledExcapeKey);
				}
				if(options.backdrop && options.backdropClick){
					backdropEl.bind('click', this.close);
				}
			};

			var unbindEvents = function(){
				if(options.keyboard){
					body.unbind('keydown', handledExcapeKey);
				}
				if(options.backdrop && options.backdropClick){
					backdropEl.unbind('click', handleBackDropClick);
				}
			};

			this.isOpen = function() { return modalEl.css('display') === 'block'; };

			this.close = function(result){

				// TODO: handle transition end event for invoking callback

				if(options.modalFade){
					modalEl.removeClass('in');
				}
				if(options.backdropFade){
					backdropEl.removeClass('in');
				}
				modalEl.hide();
				if(options.backdrop) {
					backdropEl.hide();
				}

				modalEl.remove();
				if(options.backdrop) {
					backdropEl.remove();
				}

				unbindEvents();

				if(options.callback) { options.callback(result); }
			};

			this.open = function(){
				
				if(options.backdrop) {
					body.append(backdropEl);
				}
				body.append($compile(modalEl)(this.options.scope));

				$timeout(function(){
					if(options.modalFade){
						modalEl.addClass('in');
					}
					if(options.backdropFade){
						backdropEl.addClass('in');
					}
				},1);

				modalEl.show();
				if(options.backdrop) {
					backdropEl.show();
				}

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
			prompt: function(opts){
				return this.open('template/prompt.html', opts);
			},
			alert: function(opts){
				return this.open('template/alert.html', opts);
			},
			open: function(template, opts){
				var dlg = new Dialog(template, opts);
				dlg.open();
				return dlg;
			}
		};
	}];
});