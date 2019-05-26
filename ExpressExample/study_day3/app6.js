var express = require( 'express'),
    http = require('http');

var app = express();

app.set('port', process.env.MessagePort || 3000);

app.use(function ( req, res, next ) {
    console.log('첫번째 미들웨어에서 요청 처리');

    var userAgent = req.header('User-Agent');
    var paramName = req.query.name;

    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
    res.write('<h1> Express 서버 응답 결과 </h1>');
    res.write('<div> User-Agent : '+ userAgent +' </div>');
    res.write('<div> Param Name : '+ paramName +' </div>');
    res.end();

});

// express server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('express server started : ', app.get('port'));
});