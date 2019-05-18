// 함수를 변수에 할당하여 add 변수가 생성될 때 함수 할당
var add = function ( a, b ) {
    return a+b;
};

var result = add(10,20);
console.log('10 + 20 = %d', result);