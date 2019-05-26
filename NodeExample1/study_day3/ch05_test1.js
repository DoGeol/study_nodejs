var http = require('http');

// 웹 서버 객체 만들기
var server = http.createServer();

// 웹 서버 시작 -> 3000 Port 대기
var port = 3000;
/*
server.listen(port, function () {
    console.log('Web Server Started : ', port);
});
*/

var host = '127.0.0.1';
server.listen(port, host, '50000', function () {
    console.log('Web Server Started : %s, %d', host, port);
});
