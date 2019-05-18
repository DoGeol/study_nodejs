// process : 내장 객체, 이미 내부적으로 EventEmitter 상속 받기 때문에 on(), emit() 메소드 사용 가능

process.on('tick', function ( count ) {
    console.log('tick 이벤트 발생 : %s', count);
});

setTimeout(function (  ) {
    console.log('2초 후에 tick 이벤트 전달 시도함');
    process.emit('tick', '2');
},2000);
