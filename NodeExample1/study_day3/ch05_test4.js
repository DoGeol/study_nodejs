var http = require('http');

// 클라이언트의 요청을 처리하는 콜백 함수 지정
var server = http.createServer(function (req, res) {
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

// 서버 종료
server.on('close', function () {
    console.log('Server Closed');
});