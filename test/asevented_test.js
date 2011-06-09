$(function() {

  module("asEvented", {
    setup: function () {},
    teardown: function () {}
  });

  test("bind and trigger", function() {
    var obj = { counter: 0 };
    asEvented.call(obj);
    obj.bind('event', function() { obj.counter += 1; });
    obj.trigger('event');
    equals(obj.counter, 1, 'counter should be incremented.');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    equals(obj.counter, 5, 'counter should be incremented five times.');
  });

  test("bind, unbind, trigger", function() {
    var obj = { counter: 0 };
    asEvented.call(obj);
    var callback = function() { obj.counter += 1; };
    obj.bind('event', callback);
    obj.trigger('event');
    obj.unbind('event');
    obj.trigger('event');
    equals(obj.counter, 1, 'counter should have only been incremented once.');
  });

  test("bind two counters", function() {
    var obj = { counterA: 0, counterB: 0 };
    asEvented.call(obj);
    var callback = function() { obj.counterA += 1; };
    obj.bind('event', callback);
    obj.bind('event', function() { obj.counterB += 1; });
    obj.trigger('event');
    obj.unbind('event', callback);
    obj.trigger('event');
    equals(obj.counterA, 1, 'counterA should have only been incremented once.');
    equals(obj.counterB, 2, 'counterB should have been incremented twice.');
  });

  test("unbind inside callback", function() {
    var obj = {counter: 0};
    asEvented.call(obj);
    var callback = function() {
      obj.counter += 1;
      obj.unbind('event', callback);
    };
    obj.bind('event', callback);
    obj.trigger('event');
    obj.trigger('event');
    obj.trigger('event');
    equals(obj.counter, 1, 'the callback should have been unbound.');
  });

  test("unbind multiple counters inside callbacks", function() {
    
    var obj = { count1: 0, count2: 0, count3: 0 };
    asEvented.call(obj);
    
    var incr1 = function(){ obj.count1 += 1; obj.unbind('event', incr1); };
    var incr2 = function(){ obj.count2 += 1; obj.unbind('event', incr2); };
    var incr3 = function(){ obj.count3 += 1; obj.unbind('event', incr3); };
    
    obj.bind('event', incr1);
    obj.bind('event', incr2);
    obj.bind('event', incr3);
    
    obj.trigger('event'); 
    obj.trigger('event');
    obj.trigger('event');
     
    equals(obj.count1, 1, 'count1 should have only been incremented once.');
    equals(obj.count2, 1, 'count2 should have only been incremented once.');
    equals(obj.count3, 1, 'count3 should have only been incremented once.');
    
  });
  
});