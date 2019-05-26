var express = require( 'express'),
    http = require('http'),
    path = require('path'),
    url = require('url');

// express 미들 웨어
var bodyParser = require('body-parser'),
    static = require('serve-static');

// 오류 핸들러 모듈 사용
var expressErrorHandler = require('express-error-handler');

// 파일 업로드용 미들웨어
var multer = require('multer');

// 클라이언트에서 ajax 요청 시 CORS(다중 서버 접속) 지원
var cors = require('cors');

var errorHandler = expressErrorHandler({
   static : {
       '404' : './html/404.html'
   }
});

var app = express();
app.set('defaultURL', 'http://localhost');
app.set('port', process.env.MessagePort || 3000);
app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());

app.use(static(path.join(__dirname, '../html')));
app.use('/uploads', static(path.join(__dirname, '../uploads')));
app.use(cors());

var storage = multer.diskStorage({
     destination : function ( req, file, callback ) {
         callback(null, 'uploads');
     },

     // 이름 저장하는 로직 이상해서 바꿈
     filename : function ( req, file, callback ) {
         var extName = path.extname(file.originalname);
         var fileName = path.basename(file.originalname, extName);
         var newFileName = fileName + '_' + Date.now() + extName;
         callback(null, newFileName);
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

router.route('/process/memo').post( upload.array('photo', 1), function ( req, res ) {
    console.log('메모 저장 실행');
    try{
        var paramName = req.body.name || req.query.name;
        var paramDate = req.body.date || req.query.date;
        var paramMemo = req.body.memo || req.query.memo;
        var files = req.files;
        var serverURL = app.get('defaultURL') + ':' + app.get('port') + '/';
        console.log('작성자 : ', paramName);
        console.log('작성일 : ', paramDate);
        console.log('메모 : ', paramMemo);

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

        if ( paramName && paramDate && paramMemo) {
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
            res.write('<h1> 메모가 저장되었습니다. </h1>');
            res.write('<div><p>작성자 : '+ paramName +'</p></div>');
            res.write('<div><p>작성일 : '+ paramDate +'</p></div>');
            res.write('<div><p>메모 : '+ paramMemo +'</p></div>');
            res.write('<div><p>서버에 저장된 사진</p>' +
                      '<img src="'+ serverURL + files[0].path +'" width="300" height="300">' +
                      '<p>이미지 경로 : '+ serverURL + files[0].path + '</p></div>');
            res.write('<br><br><a href="/memo.html">다시 작성</a>');
            res.end();
        } else {
            res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
            res.write('<h1> 메모 저장 실패 </h1>');
            res.write('<br><br><a href="/memo.html">다시 작성</a>');
            res.end();
        }

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