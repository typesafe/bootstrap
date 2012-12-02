angular.module('ui.bootstrap.dialog', []).provider("$dialog", function(){

	var defaults = {
		backdrop: true,
		modalClass: 'modal',
		backdropClass: 'modal-backdrop',
		controller:null,
		resolve:{},
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

	this.$get = ["$http","$document","$compile","$rootScope","$controller","$templateCache", "$q", function ($http, $document, $compile, $rootScope, $controller, $templateCache, $q) {

		var body = $document.find('body');

		function createElement(clazz, fade) {
			var el = angular.element("<div>");
			el.addClass(clazz);
			if(fade){
				el.addClass('fade');
				el.removeClass('in'); // just to be sure
			}
			return el;
		}


		function Dialog(opts) {
      var self = this;
			var options = self.options = angular.extend({}, defaults, globalOptions, opts);
      var promises = {};
      var open = false;
			var backdropEl = createElement(options.backdropClass, options.backdropFade);
			var modalEl = createElement(options.modalClass, options.modalFade);

      //Create lots of functions
      function createPromise(name) {
        self[name] = function(cb) {
          promises[name] = cb;
          return self;
        };
      }
      function handledEscapeKey(e) {
        if (e.keyCode === 27) {
          self.close();
          e.preventDefault();
        }
      }
      function handleBackDropClick(e) {
        self.close();
        e.preventDefault();
      }
      function bindEvents() {
        if(options.keyboard){ body.bind('keydown', handledEscapeKey); }
        if(options.backdrop && options.backdropClick){ backdropEl.bind('click', handleBackDropClick); }
      }
      function unbindEvents() {
        if(options.keyboard){ body.unbind('keydown', handledEscapeKey); }
        if(options.backdrop && options.backdropClick){ backdropEl.unbind('click', handleBackDropClick); }
      }
      function onCloseComplete(result) {
        open = false;
        modalEl.remove();
        if(options.backdrop) { backdropEl.remove(); }

        unbindEvents();

        if(options.callback) { options.callback(result); }
        if(promises[result]) {
          promises[result](result);
        }
        if(promises['closed']){
          promises['closed'](result);
        }
      }

     /* // add promise method for each button
      angular.forEach((options.resolve || {}).buttons || [], function(btn) {
        createPromise(btn.result);
      });
      */
      createPromise('closed');

      self.isOpen = function() {
        return open;
      };

      self.close = function(result){
        function transitionHandler(e) {
          modalEl.unbind(angularUI.getTransitionEndEventName(), transitionHandler);
          onCloseComplete(result);
        }

        /*modalEl.bind(angularUI.getTransitionEndEventName(), transitionHandler);*/
        if(options.modalFade){
          modalEl.removeClass('in');

          if(options.backdropFade){
            backdropEl.removeClass('in');
          }
          return;
        }

        onCloseComplete(result);
      };

      //Resolve all the `resolve` options and the template
      //This is stolen almost straight from angular $route source code
      function loadResolves() {
        var values = [], keys = [], template;
        if (template = options.template) {
        } else if (template = options.templateUrl) {
          template = $http.get(options.templateUrl, {cache:$templateCache})
          .then(function(response) { return response.data; });
        }
        angular.forEach(options.resolve || [], function(value, key) {
          keys.push(key);
          values.push(value);
        });
        keys.push('$template');
        values.push(template);
        return $q.all(values).then(function(values) {
          var locals = {};
          angular.forEach(values, function(value, index) {
            locals[keys[index]] = value;
          });
          return locals;
        });
      }
      self.open = function(){
        loadResolves().then(function(locals) {
          var $scope = locals.$scope = $rootScope.$new();

          modalEl.html(locals.$template);
          if (options.controller) {
            var ctrl = $controller(options.controller, locals);
            modalEl.contents().data('ngControllerController', ctrl);
          }

          $compile(modalEl.contents())($scope);
          body.append(modalEl);
          if(options.backdrop) { body.append(backdropEl); }
          open = true;

          //Add classes after a short timeout
          setTimeout(function(){
            if(options.modalFade){ modalEl.addClass('in'); }
            if(options.backdropFade){ backdropEl.addClass('in'); }
          });

          bindEvents();
        });
      };
    }

    // This version returns a SERVICE that allows you to open dialogs specifying a template and optional options. The 
    // open method returns an object that represents the dialog and allows, closing it (and opening it again)

    // Another option would be returning a CONSTRUCTOR that creates a dialog, but does not show it immediately. 

    // I'm leaning towards the first option:
    //	- it does not manipulate the DOM unless it has to, self could be done with the .ctor version as well, 
    //	but that feels a bit awkward, I think
    //	- The injected $dialog could also support Prompt, Alert, etc. which makes it defintely a service.

    // ze $dialog servize
    return {
      /*
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
            resolve: {
              title:title,
              message:message,
              buttons:buttons // [{label:, cssClass:, result:}]
            }, 
            templateUrl: 'template/dialog/message.html'
        });

        return this.open(options);
      },*/
      open: function(opts){
        if(!(opts.template || opts.templateUrl)) {
          throw new Error('dialog.open expected options.template or options.templateUrl, neither found.');
        }
        var dlg = new Dialog(opts);
        dlg.open();
        return dlg;
      }
    };
  }];
});
