var util = require('util');
var EventEmitter = require('events').EventEmitter;

var Calc = function (  ) {
    var self = this;

    this.on('stop', function (  ) {
        console.log('Calc에 stop evnet 전달됨.');
    });
};

// inherits 메소드를 사용하여 calc 객체가 이벤트를 처리 할 수 있도록 EventEmitter를 상속
util.inherits(Calc, EventEmitter);

Calc.prototype.add = function ( a, b ) {
    return a + b;
};

module.exports = Calc;
module.exports.title = 'calculator';