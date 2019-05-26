var express = require( 'express'),
    http = require('http'),
    path = require('path');

// express 미들 웨어
var bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    static = require('serve-static');

// 오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// Session 미들웨어
var expressSession = require('express-session');

// 파일 업로드용 미들웨어
var multer = require('multer');
var fs = require('fs');

// 클라이언트에서 ajax 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');

var errorHandler = expressErrorHandler({
    static : {
        '404' : './public/404.html'
    }
});

var app = express();
app.set('port', process.env.MessagePort || 3000);
app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());

app.use('/public', static(path.join(__dirname, 'public')));
app.use('/uploads', static(path.join(__dirname, 'uploads')));

app.use(cookieParser());

app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true
}));

app.use(cors());

// multer 미들웨어 사용 : 미들웨어 사용 순서 중요 body-parser -> multer -> router
// 파일 제한 : 10개, 1G
var storage = multer.diskStorage({
    destination : function ( req, file, callback ) {
        callback(null, 'uploads');
    },

    // 저장하는 로직 이상해서 바꿈
    filename : function ( req, file, callback ) {
        var fileName = file.originalname.split('.'),
            newFileName = fileName[0] + Date.now();
        fileName.splice(0,1, newFileName);
        callback(null, fileName.join('.'));
    }
});

var upload = multer({
    storage : storage,
    limits : {
        files : 10,
        fileSize : 1024 * 1024 * 1024
    }
});

var router = express.Router();

router.route('/process/photo').post(upload.array('photo', 1), function ( req, res ) {
    console.log('/process/photo 호출');

    try {
        var files = req.files;

        console.dir('#===== 업로드된 첫번째 파일 정보 =====#');
        console.dir(req.files[0]);
        console.dir('#=====#');

        // 현재의 파일 정보를 저장할 변수 선언
        var originalName = '',
            fileName = '',
            mimeType = '',
            size = 0;

        if ( Array.isArray(files) ) {
            console.log('배열에 들어있는 파일 갯수 : ', files.length);

            for ( var index = 0; index <files.length; index++ ){
                originalName = files[index].originalname;
                fileName = files[index].filename;
                mimeType = files[index].mimetype;
                size = files[index].size;
            }
        }

        console.log('현재 파일 정보 : ', originalName + ', ' + fileName + ', ' + mimeType + ', ' + size );
        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
        res.write('<h3>파일 업로드 성공</h3>');
        res.write('<hr/>');
        res.write('<p>원본 파일 이름 : ' + originalName + ' -> 저장 파일명 : ' + fileName + '</p>');
        res.write('<p>Mime Type : ' + mimeType + '</p>');
        res.write('<p>파일 크기 : ' + size + '</p>');
        res.end();
    } catch ( err ) {
        console.dir(err.stack);
    }
});

app.use('/', router);
app.use( expressErrorHandler.httpError(404) );
app.use( errorHandler );

// express server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('express server started : ', app.get('port'));
});