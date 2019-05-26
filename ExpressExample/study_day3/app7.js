var express = require( 'express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    static = require('serve-static');

var app = express();

app.set('port', process.env.MessagePort || 3000);

app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());
app.use(static(path.join(__dirname, 'public')));

app.use(function ( req, res, next ) {
    console.log('첫번째 미들웨어에서 요청 처리');

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
    res.write('<h1> Express 서버 응답 결과 </h1>');
    res.write('<div> paramId : '+ paramId +' </div>');
    res.write('<div> paramPassword : '+ paramPassword +' </div>');
    res.end();

});

// express server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('express server started : ', app.get('port'));
});
