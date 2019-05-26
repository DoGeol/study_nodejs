var express = require( 'express'),
    http = require('http'),
    path = require('path');

// express 미들 웨어
var bodyParser = require('body-parser'),
    static = require('serve-static');

// 오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// 클라이언트에서 ajax 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');

var errorHandler = expressErrorHandler({
   static : {
       '404' : 'html/404.html'
   }
});

var app = express();
app.set('port', process.env.MessagePort || 3000);
app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());

app.use(static(path.join(__dirname, '../html')));
app.use(cors());

var router = express.Router();

router.route('/process/memo').post( function ( req, res ) {
    console.log('메모 저장 실행');

    var paramName = req.body.name || req.query.name;
    var paramDate = req.body.date || req.query.date;
    var paramMemo = req.body.memo || req.query.memo;

    console.log('작성자 : ', paramName);
    console.log('작성일 : ', paramDate);
    console.log('메모 : ', paramMemo);

    if ( paramName && paramDate && paramMemo ) {
        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
        res.write('<h1> 메모가 저장되었습니다. </h1>');
        res.write('<div><p>작성자 : '+ paramName +'</p></div>');
        res.write('<div><p>작성일 : '+ paramDate +'</p></div>');
        res.write('<div><p>메모 : '+ paramMemo +'</p></div>');
        res.write('<br><br><a href="/memo.html">다시 작성</a>');
        res.end();
    } else {
        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
        res.write('<h1> 메모 저장 실패 </h1>');
        res.write('<br><br><a href="/memo.html">다시 작성</a>');
        res.end();
    }
});

app.use('/', router);
app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

// express server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('express server started : ', app.get('port'));
});