function add( a, b, callback  ) {
    var result = a + b;
    callback(result);

    var history = function (  ) {
        return a + ' + ' + b + ' = ' + result;
    };
    return history;
}

var add_history = add(10,10,function ( result ) {
    console.log('파라미터로 전달된 콜백 함수 호출됨.');
    console.log('더하기 (10,10)의 결과 : %d', result);
});

console.log('결과 값으로 받은 함수 실행 결과 : ' + add_history());
// 노드에서는 대부분의 코드를 비동기 식으로 만듦 -> 결과 값을 콘솔에 뿌려줄 수 있음