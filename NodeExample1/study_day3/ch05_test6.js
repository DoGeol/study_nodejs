var http = require('http');
var fs = require('fs');

// 웹 서버 객체 생성
var server = http.createServer();

// 웹 서버를 시작하여 3000 포트 대기
var port = 3000;
server.listen(port, function () {
    console.log('Web Server Started : ', port);
});

// 클라이언트 연결 이벤트 처리
server.on('connection', function (socket) {
    var addr = socket.address();
    console.log('Client Connected Success : ', addr.address, addr.port);
});

// 클라이언트 요청 이벤트 처리
server.on('request', function (req, res) {
    console.log('Client call request');
    var fileName = 'pdg.png';
    var inFile = fs.createReadStream(fileName, {flags : 'r'});

    // Pipe() 메소드를 사용하여 연결
    inFile.pipe(res);

});

// 서버 종료
server.on('close', function () {
    console.log('Server Closed');
});