/**
 * express 주요 메소드
 * set(name, value)                        : 서버 설정을 위한 속성 지정
 * get(name)                               : 서버 설정을 위해 지정한 속성을 꺼내옴
 * use([path], function, [function...])    : 미들웨어 함수 사용
 * get([path], function)                   : 특정 path로 요청된 정보를 처리
 **/

// Express 기본 모듈 불러오기
var express = require( 'express'),
    http = require('http');

// express object create
var app = express();

// 기본 포트를 app 객체에 속성으로 설정
app.set('port', process.env.MessagePort || 3000 );

// express server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('express server started : ', app.get('port'));
});