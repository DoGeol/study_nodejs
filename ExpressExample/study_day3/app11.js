var express = require( 'express'),
    http = require('http'),
    path = require('path');

var bodyParser = require('body-parser'),
    static = require('serve-static');

var cookieParser = require('cookie-parser');

// 오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

var app = express();
app.use(cookieParser());
var router = express.Router();

app.set('port', process.env.MessagePort || 3000);

app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());
app.use(static(path.join(__dirname, 'public')));

router.route('/process/showCookie').get(function ( req, res ) {
    console.log('/process/showCookie 호출');
    res.send(req.cookies);
});

router.route('/process/setUserCookie').get(function ( req, res ) {
    console.log('/process/setUserCookie 호출');

    res.cookie('user', {
        id : 'pdg',
        name : '편도걸',
        authorized : true
    });

    res.redirect('/process/showCookie');

});

app.use('/', router);

// 모든 router 처리 끝난 후 404 오류 페이지 처리
var errorHandler = expressErrorHandler({
    static : {
        '404' : './public/404.html'
    }
});

app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

// express server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('express server started : ', app.get('port'));
});
