var express = require( 'express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    static = require('serve-static');

var router = express.Router();
var app = express();

app.set('port', process.env.MessagePort || 3000);

app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());
app.use(static(path.join(__dirname, 'public')));

router.route('/process/login/:name').post(function ( req, res ) {
    console.log('/process/login:name 처리');

    var paramName = req.params.name;

    var paramId = req.body.id || req.query.id;
    var paramPassword = req.body.password || req.query.password;

    res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
    res.write('<h1> Express 서버 응답 결과 </h1>');
    res.write('<div><p>paramName : '+ paramName +'</p></div>');
    res.write('<div><p>paramId : '+ paramId +'</p></div>');
    res.write('<div><p>paramPassword : '+ paramPassword +'</p></div>');
    res.write('<br><br><a href="/login3.html">로그인 페이지로 돌아가기</a>');
    res.end();
});

app.use('/', router);

// express server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('express server started : ', app.get('port'));
});
