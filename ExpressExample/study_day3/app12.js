var express = require( 'express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    static = require('serve-static');

var cookieParser = require('cookie-parser');
var expressSession = require('express-session');

// 오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

var app = express();
app.use(cookieParser());
app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true
}));

var router = express.Router();

app.set('port', process.env.MessagePort || 3000);

app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());
app.use(static(path.join(__dirname, 'public')));

router.route('/process/product').get(function ( req, res ) {
    console.log('/process/product 호출');
    if ( req.session.user ) {
        res.redirect('/product.html');
    } else {
        res.redirect('/login2.html');
    }
});

app.use('/', router);

// 모든 router 처리 끝난 후 404 오류 페이지 처리
var errorHandler = expressErrorHandler({
    static : {
        '404' : './public/404.html'
    }
});

// 로그인 라우팅 함수 - 로그인 후 세션 저장
router.route('/process/login2').post(function ( req, res ) {
    console.log('/process/login2 호출');

    var paramId = req.body.id || req.query.id;
    var paramPw = req.body.password || req.query.password;

    if ( req.session.user ) {
        console.log('이미 로그인되어 상품 페이지로 이동합니다.');
        res.redirect('/product.html');
    } else {
        req.session.user = {
            id : paramId,
            name : 'PDG',
            authorized : true
        };

        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
        res.write('<h1>로그인 성공</h1>');
        res.write('<div><p>paramId : '+ paramId +'</p></div>');
        res.write('<div><p>paramPassword : '+ paramPw +'</p></div>');
        res.write('<br><br><a href="/product.html">상품 페이지로 이동하기</a>');
        res.end();
    }
});

router.route('/process/logout').get(function ( req, res ) {
    console.log('/process/logout 호출');

    if(req.session.user){
        console.log('로그아웃 합니다.');
        req.session.destroy(function ( err ) {
            if ( err ) throw err;
            console.log('세션을 삭제하고 로그아웃 되었습니다.');
            res.redirect('/login2.html');
        });
    } else {
        console.log('로그인 되어 있지 않습니다.');
        res.redirect('/login2.html');
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

// express server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('express server started : ', app.get('port'));
});
