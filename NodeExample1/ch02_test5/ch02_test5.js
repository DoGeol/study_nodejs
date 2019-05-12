// calc.js
var calc = require('./calc');
console.log('모듈로 분리한 후 - calc.add 함수 호출 결과 : %d', calc.add(10,10));

// calc2.js
var calc2 = require('./calc2');
console.log('모듈로 분리한 후 - calcs.add 함수 호출 결과 : %d', calc2.add(11, 11));
