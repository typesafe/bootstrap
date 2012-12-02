/*describe('$dialog', function(){

	var $document, $compile, $scope, $rootScope, $dialog, provider;

	beforeEach(module('ui.bootstrap.dialog'));
	beforeEach(module('template/dialog/message.html'));

	beforeEach(function(){
		module('ui.bootstrap.dialog');
		inject(function(_$document_, _$compile_, _$rootScope_, _$dialog_){
			$document = _$document_;
			$compile = _$compile_;
			$scope = _$rootScope_.$new();
			$rootScope = _$rootScope_;
			$dialog = _$dialog_;
		});
	});

	describe('when opening a message box', function(){

		var d;
		beforeEach(function(){
			d = $dialog.message('this is the title', 'this is the message', [{label:'OK', cssClass:'btn-primary', result:'foo'}]);
			$rootScope.$digest();
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

		it('should ad the dialog to the scope', function(){
			expect(d.options.scope.dialog).toBe(d);
		});

		iit('should add a button for the specified button', function(){
      dump($document.find('div.modal'));
			expect($document.find('body > div.modal > div.modal-footer > button').length).toBe(1);
		});

		it('the added button should have the specified label', function(){
			expect($document.find('body > div.modal > div.modal-footer > button').text()).toBe('OK');
		});

		it('the added button should have the btn class', function(){
			expect($document.find('body > div.modal > div.modal-footer > button').hasClass('btn-primary')).toBe(true);
		});
	});

	describe('handling result through promise', function(){
		var d, result;
		beforeEach(function(){
			d = $dialog.message('title', 'message', [{label:'foo', result: 'ok'},{label:'bar', result: 'cancel'}])
			.ok(function(res){ result = 'ok called';})
			.cancel(function(res){ result = 'cancel called';});
      $rootScope.$apply();
			
		});

		it('should call ok function when closing with ok result', function(){
			d.close('ok');
			expect(result).toBe('ok called');
		});

		it('should call cancel function when closing with cancel result', function(){
			d.close('cancel');
			expect(result).toBe('cancel called');
		});
	});
});*/
