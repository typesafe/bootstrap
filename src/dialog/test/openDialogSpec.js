describe('$dialog', function(){

	var $document, $compile, $scope, $rootScope, $dialog, provider;

	beforeEach(module('ui.bootstrap.dialog'));
	beforeEach(function(){
		
		module(function($dialogProvider){
			provider = $dialogProvider;
		});
		inject(function(_$document_, _$compile_, _$rootScope_, _$dialog_){
			$document = _$document_;
			$compile = _$compile_;
			$scope = _$rootScope_.$new();
			$rootScope = _$rootScope_;
			$dialog = _$dialog_;
		});
	});

	it('provider service should be injected in module', function(){
		expect(provider).toBeDefined();
	});

	it('dialog service should be injected', function(){
		expect($dialog).toBeDefined();
	});

	describe('handling result through promise', function(){
		var d, result;
		beforeEach(function(){
			d = $dialog.open({template:'foo'})
			.closed(function(res){result = res;});
      $rootScope.$apply(); //$apply after opening to auto-load .resolve promises (template for example)
			d.close('res');
		});

		it('should call function', function(){
			expect(result).toBe('res');
		});
	});

	describe('opening a dialog', function(){

		var d;
		beforeEach(function(){
			d = $dialog.open({template:'foo'});
      $rootScope.$apply();
		});
		afterEach(function(){
			d.close();
		});

		it('the dialog.isOpen() should be true', function(){
			expect(d.isOpen()).toBe(true);
		});

		it('the modal should be included in the DOM', function(){
			expect($document.find('body > div.modal').length).toBe(1);
		});

		it('the backdrop should be included in the DOM', function(){
			expect($document.find('body > div.modal-backdrop').length).toBe(1);
		});

		it('a dialog instance should be returned', function(){
			expect(d).toBeDefined();
		});
	});

	describe('opening with global options', function(){

		var d;
		afterEach(function(){
			d.close();
			provider.options({});
		});

		var setOptionBeforeEachAndOpen = function(opts){
			beforeEach(function(){
				provider.options(opts);
				d = $dialog.open({template:'foo'});
        $rootScope.$apply();
			});
		};

		describe('backdrop:false', function(){
			setOptionBeforeEachAndOpen({backdrop: false});

			it('backdrop false should not include a backdrop in the DOM', function(){
				expect($document.find('body > div.modal-backdrop').length).toBe(0);
			});

			it('backdrop false should include the modal in the DOM', function(){
				expect($document.find('body > div.modal').length).toBe(1);
			});
		});

		describe('modalClass:foo, backdropClass:bar', function(){
			setOptionBeforeEachAndOpen({modalClass: 'foo', backdropClass: 'bar'});

			it('backdrop class should be changed', function(){
				expect($document.find('body > div.bar').length).toBe(1);
			});

			it('the modal should be change', function(){
				expect($document.find('body > div.foo').length).toBe(1);
			});
		});
	});

	describe('closing a dialog', function(){
		
		var d;
		
		beforeEach(function(){
			d = $dialog.open({template:'foo'});
      $rootScope.$apply();
			d.close();
		});

		describe('opening it again', function(){
			beforeEach(function(){
				expect($document.find('body > div.modal-backdrop').length).toBe(0);
				d.open();
        $rootScope.$apply();
			});
			afterEach(function(){
				d.close();
			});

			it('the dialog.isOpen() should be true', function(){
				expect(d.isOpen()).toBe(true);
			});

			it('the backdrop should be displayed', function(){
			expect($document.find('body > div.modal-backdrop').css('display')).toBe('block');
			});

			it('the modal should be displayed', function(){
				expect($document.find('body > div.modal').css('display')).toBe('block');
			});
		});

		it('dialog.isOpen() should be false', function(){
			expect(d.isOpen()).toBe(false);
		});

		it('should not display the backdrop', function(){
			expect($document.find('body > div.modal-backdrop').length).toBe(0);
		});

		it('should not display the modal', function(){
			expect($document.find('body > div.modal').length).toBe(0);
		});
	});

  describe('with a controller', function() {
    var ctrl, d;

    beforeEach(inject(function($controller) {
      function TestController($scope, cake, dialog) {
        $scope.cake = cake;
        $scope.dialog = dialog;
      }
      d = $dialog.open({
        template: '<div class="content">{{cake}} - {{dialog.isOpen()}}</div>',
        controller: TestController,
        resolve: {
          cake: "chocolate"
        }
      });
      $rootScope.$apply();
    }));

    iit('should have interpolated cake and dialog.isOpen()', function() { 
      var el = $document.find('body > div.modal');
      dump(el);
      dump(d.isOpen());
      expect(el.find('div.content').text()).toEqual('chocolate - true');
    });
  });
});
