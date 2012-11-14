describe('$dialog', function(){

	var $document,$compile,$rootScope,$controller,$dialog, provider;

	beforeEach(function(){
		module('ui.bootstrap.dialog');
		module(function($dialogProvider){
			provider = $dialogProvider;
		});
		inject(function(_$document_, _$compile_, _$rootScope_, _$controller_, _$dialog_){
			$document = _$document_;
			$compile = _$compile_;
			$rootScope = _$rootScope_;
			$controller = _$controller_;
			$dialog = _$dialog_;
		});
	});

	it('provider service should be injected', function(){
		expect(provider).toBeDefined();
	});

	it('dialog service should be injected', function(){
		expect($dialog).toBeDefined();
	});

	describe('opening without module level configuration', function(){

		var d;
		beforeEach(function(){
			d = $dialog.open();
		});

		it('should default to using a backdrop', function(){
			expect($document.find('body > div.modal').length).toBe(1);
			
		});

	});

	describe('opening with module level configuration', function(){
		beforeEach(function(){
			provider.options = {backdrop: false};
		});

		it('dialog should be injected', function(){
			expect($dialog).toBeDefined();
			
		});

	});

	/*bvar $document,$compile,$rootScope,$controller,$dialog, provider;

	beforeEach(module('ui.bootstrap.dialog'));

	beforeEach(module(function($dialogProvider){
		provider = $dialogProvider;
	}));

	/beforeEach(inject(function(_$document_, _$compile_, _$rootScope_, _$controller_, _$dialog_){
		$document = _$document_;
		$compile = _$compile_;
		$rootScope = _$rootScope_;
		$controller = _$controller_;
		$dialog = _$dialog_;
	}));

	it('should be injected', function(){
		expect($dialog).toBeDefined();
	});

	describe('opening without options', function(){

		it('should include dialog element', function(){

		});
	});

	describe('opening with global options', function(){

	});

	describe('opening with on-the-fly options', function(){

	});
*/
});