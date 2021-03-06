var http = require('http');

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
    res.writeHead(200, {"Content-Type":"text/html; charset=utf-8"});
    var html = "<!DOCTYPE html>" +
               "<html>" +
               "    <head>" +
               "        <title> Request Page </title>" +
               "    </head>" +
               "    <body>" +
               "        <h1> FROM NodeJs Request Page</h1>" +
               "    </body>" +
               "</html>";
    res.write(html);
    res.end();
});

// 서버 종료
server.on('close', function () {
    console.log('Server Closed');
});
