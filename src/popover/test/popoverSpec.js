describe('popover', function() {
  var scope, elm, $compile;

  beforeEach(module('ui.bootstrap.popover'));
  beforeEach(inject(function($rootScope, _$compile_) {
    scope = $rootScope.$new();
    $compile = _$compile_;
  }));

  it('should create a popover element with proper contents and a title', function() {
    elm = $compile('<popover id="popeye" title="hello"><span id="inside">Whats Up!</span></popover>')(scope);
    scope.$apply();
    expect($(".popover", elm).length).toBeGreaterThan(0);
    expect($(".popover-title", elm).text()).toBe("hello");
    expect($("#inside", elm).text()).toBe("Whats Up!");
  });

  it('should give error if no id given for popover', function() {
    expect(function() {
      elm = $compile('<popover></popover')(scope);
    }).toThrow();
  });

  it('should interpolate the title', function() {
    scope.person = "Andy";
    elm = $compile("<popover id='a' title='hello, {{person}}!'>Content</popover>")(scope);
    scope.$apply();
    expect($(".popover-title", elm).text()).toBe("hello, Andy!");
  });
  
  it('should show popover when model is true', function() {
    var pop = $(".popover", $compile("<popover id='a'>Hi</popover>")(scope));
    elm = $compile("<a pop-target='a' show='value'></a>")(scope);
    scope.$apply();
    expect(pop).not.toHaveClass('in');
    scope.$apply('value = true');
    expect(pop).toHaveClass('in');
    scope.$apply('value = false');
    expect(pop).not.toHaveClass('in');
  });
});
