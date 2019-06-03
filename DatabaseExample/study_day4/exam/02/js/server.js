var express             = require( 'express' ),
    http                = require( 'http' ),
    path                = require( 'path' ),
    url                 = require( 'url' );
// express 미들 웨어
var bodyParser          = require( 'body-parser' ),
    static              = require( 'serve-static' );
// 오류 핸들러 모듈 사용
var expressErrorHandler = require( 'express-error-handler' );
// 파일 업로드용 미들웨어
var multer              = require( 'multer' );
// 클라이언트에서 ajax 요청 시 CORS(다중 서버 접속) 지원
var cors                = require( 'cors' );
var errorHandler        = expressErrorHandler( {
                                                   static : {
                                                       '404' : './html/404.html'
                                                   }
                                               } );
var mysql               = require( 'mysql' );
var pool                = mysql.createPool( {
                                                connectionLimit : 10,
                                                host            : 'localhost',
                                                user            : '',
                                                password        : '',
                                                database        : 'node_test',
                                                debug           : false
                                            } );
var app                 = express();
app.set( 'defaultURL', 'http://localhost' );
app.set( 'port', process.env.MessagePort || 3000 );
app.use( bodyParser.urlencoded( { extended : false } ) );
app.use( bodyParser.json() );
app.use( static( path.join( __dirname, '../html' ) ) );
app.use( '/uploads', static( path.join( __dirname, '../uploads' ) ) );
app.use( cors() );
var storage = multer.diskStorage( {
                                      destination : function ( req, file, callback ) {
                                          callback( null, 'uploads' );
                                      },
                                      // 이름 저장하는 로직 이상해서 바꿈
                                      filename    : function ( req, file, callback ) {
                                          var extName     = path.extname( file.originalname );
                                          var fileName    = path.basename( file.originalname, extName );
                                          var newFileName = fileName + '_' + Date.now() + extName;
                                          callback( null, newFileName );
                                      }
                                  } );
var upload  = multer( {
                          storage : storage,
                          limits  : {
                              files    : 10,
                              fileSize : 1024 * 1024 * 1024
                          }
                      } );
var router  = express.Router();
router.route( '/process/memo' ).post( upload.array( 'photo', 1 ), function ( req, res ) {
    console.log( '메모 저장 실행' );
    try {
        var paramName = req.body.name || req.query.name;
        var paramDate = req.body.date || req.query.date;
        var paramMemo = req.body.memo || req.query.memo;
        var files     = req.files;
        var serverURL = app.get( 'defaultURL' ) + ':' + app.get( 'port' ) + '/';
        console.log( '작성자 : ', paramName );
        console.log( '작성일 : ', paramDate );
        console.log( '메모 : ', paramMemo );
        var originalName = '',
            fileName     = '',
            mimeType     = '',
            size         = 0;
        if ( Array.isArray( files ) ) {
            console.log( '배열에 들어있는 파일 갯수 : ', files.length );
            for ( var index = 0; index < files.length; index++ ) {
                originalName = files[ index ].originalname;
                fileName     = files[ index ].filename;
                mimeType     = files[ index ].mimetype;
                size         = files[ index ].size;
            }
        }
        if ( pool ) {
            saveMemo( paramName, paramDate, paramMemo, serverURL + files[ 0 ].path, function ( err, savedMemo ) {
                if ( err ) {
                    console.error( '메모 추가 중 오류 발생 : ', err.stack );
                    res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                    res.write( '<h1>메모 추가 중 오류 발생</h1>' );
                    res.write( '<p>' + err.stack + '</p>' );
                    res.end();
                    return;
                }
                if ( savedMemo ) {
                    console.log( 'inserted ' + savedMemo.affectedRows + ' rows' );
                    res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                    res.write( '<h1> 메모가 저장되었습니다. </h1>' );
                    res.write( '<div><p>작성자 : ' + paramName + '</p></div>' );
                    res.write( '<div><p>작성일 : ' + paramDate + '</p></div>' );
                    res.write( '<div><p>메모 : ' + paramMemo + '</p></div>' );
                    res.write( '<div><p>서버에 저장된 사진</p>' +
                               '<img src="' + serverURL + files[ 0 ].path + '" width="300" height="300">' +
                               '<p>이미지 경로 : ' + serverURL + files[ 0 ].path + '</p></div>' );
                    res.write( '<br><br><a href="/memo.html">다시 작성</a>' );
                    res.end();
                } else {
                    res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                    res.write( '<h1> 메모 저장 실패 </h1>' );
                    res.write( '<br><br><a href="/memo.html">다시 작성</a>' );
                    res.end();
                }
            } );
        } else {
            res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
            res.write( '<h1>Database 연결 실패</h1>' );
            res.write( '<div><p>연결 못했쑴</p></div>' );
            res.end();
        }
    } catch ( err ) {
        console.dir( err.stack );
    }
} );
app.use( '/', router );
app.use( expressErrorHandler.httpError( 404 ) );
app.use( errorHandler );
var saveMemo = function ( name, date, memo, imagePath, callback ) {
    console.log( 'save Memo start' );
    pool.getConnection( function ( err, conn ) {
        if ( err ) {
            if ( conn ) {
                conn.release();
            }
            callback( err, null );
            return;
        }
        var data = { name : name, date : date, memo : memo, image_path : imagePath };
        var exec = conn.query( 'insert into image_save_test set ?', data, function ( err, result ) {
            conn.release();
            console.log( 'test : ', exec.sql );
            if ( err ) {
                console.log( 'SQL 오류 발생' );
                console.dir( err );
                callback( err, null );
                return;
            }
            callback( null, result );
        } );
    } );
};
// express server start
http.createServer( app ).listen( app.get( 'port' ), function () {
    console.log( 'express server started : ', app.get( 'port' ) );
} );