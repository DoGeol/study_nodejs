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
    var fileLength = 0;
    var curLength = 0;

    fs.stat(fileName, function (err, stats) {
        fileLength = stats.size;
    });

    // 헤더 쓰기
    res.writeHead(200, {'Content-Type' : 'image/png'});

    // 파일 내용을 스트림에서 읽어 본문 쓰기
    inFile.on('readable', function () {
        var chunk;
        while ( null !== ( chunk = inFile.read() ) ){
            console.log( 'Read file data : ', chunk.length );
            curLength += chunk.length;
            res.write( chunk, 'utf-8', function ( err ) {
                console.log('File write success : %d, File Size : %s', curLength, fileLength);
                if( curLength >= fileLength ){
                    res.end();
                }
            })
        }
    });

});

// 서버 종료
server.on('close', function () {
    console.log('Server Closed');
});