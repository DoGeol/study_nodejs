// process : 내장 객체, 이미 내부적으로 EventEmitter 상속 받기 때문에 on(), emit() 메소드 사용 가능

process.on('exit', function (  ) {
    console.log('exit 이벤트 발생');
});

setTimeout(function (  ) {
    console.log('2초 후에 시스템 종료 시도함');
    process.exit();
},2000);
