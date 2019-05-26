var express = require( 'express'),
    http = require('http');

var app = express();

app.set('port', process.env.MessagePort || 3000);

app.use(function ( req, res, next ) {
    console.log('첫번째 미들웨어에서 요청 처리');
    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
    res.end('<h1>Express 서버에서 응답한 결과</h1>');
});
// express server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('express server started : ', app.get('port'));
});
