var express             = require( 'express' ),
    http                = require( 'http' ),
    path                = require( 'path' );
// express 미들 웨어
var bodyParser          = require( 'body-parser' ),
    static              = require( 'serve-static' );
// 오류 핸들러 모듈 사용
var expressErrorHandler = require( 'express-error-handler' );
var errorHandler        = expressErrorHandler( {
                                                   static : {
                                                       '404' : './html/404.html'
                                                   }
                                               } );
//FIXME mongodb\
var mongoose            = require( 'mongoose' );
var app                 = express();
app.set( 'port', process.env.MessagePort || 3000 );
app.use( bodyParser.urlencoded( { extended : false } ) );
app.use( bodyParser.json() );
app.use( static( path.join( __dirname, '../html' ) ) );
var database;
var userSchema;
var userModel;
function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';
    console.log( 'database connected' );
    mongoose.Promise = global.Promise;
    mongoose.connect( databaseUrl );
    database = mongoose.connection;
    database.on( 'error', console.error.bind( console, 'mongoose connection error' ) );
    database.on( 'open', function () {
        console.log( 'database connected : ', databaseUrl );
        createUserSchema();
    } );
    database.on( 'disconnected', function () {
        console.log( 'database unconnected, 5초후 재연결 시도' );
        setInterval( connectDB, 5000 );
    } );
}
function createUserSchema() {
    userSchema = mongoose.Schema( {
                                      name      : {
                                          type      : String,
                                          index     : 'hashed',
                                          'default' : ''
                                      },
                                      memo      : {
                                          type      : String,
                                          'default' : ''
                                      },
                                      create_at : {
                                          type      : Date,
                                          index     : { unique : false },
                                          'default' : Date.now
                                      },
                                      update_at : {
                                          type      : Date,
                                          index     : { unique : false },
                                          'default' : Date.now
                                      }
                                  } );
    console.log( 'userSchema 정의 완료' );
    userModel = mongoose.model( 'memo1', userSchema );
    console.log( 'userModel 정의 완료' );
}
var saveMemo = function ( database, name, memo, callback ) {
    console.log( 'saveMemo call' );
    var saveInfo = new userModel( {
                                      name : name,
                                      memo : memo
                                  } );
    saveInfo.save( function ( err ) {
        if ( err ) {
            callback( err, null );
            return;
        }
        console.log( 'save 성공' );
        callback( null, saveInfo );
    } );
};
var router   = express.Router();
router.route( '/process/memo' ).post( function ( req, res ) {
    console.log( '메모 저장 실행' );
    var paramName = req.body.name || req.query.name;
    var paramDate = req.body.date || req.query.date;
    var paramMemo = req.body.memo || req.query.memo;
    console.log( '작성자 : ', paramName );
    console.log( '작성일 : ', paramDate );
    console.log( '메모 : ', paramMemo );
    if ( database ) {
        saveMemo( database, paramName, paramMemo, function ( err, result ) {
            console.dir( result );
            if ( err ) {
                throw err;
            }
            if ( result ) {
                res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                res.write( '<h1> 메모가 저장되었습니다. </h1>' );
                res.write( '<div><p>작성자 : ' + result._doc.name + '</p></div>' );
                res.write( '<div><p>작성일 : ' + result._doc.update_at + '</p></div>' );
                res.write( '<div><p>메모 : ' + result._doc.memo + '</p></div>' );
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
} );
app.use( '/', router );
app.use( expressErrorHandler.httpError( 404 ) );
app.use( errorHandler );
// express server start
http.createServer( app ).listen( app.get( 'port' ), function () {
    console.log( 'express server started : ', app.get( 'port' ) );
    connectDB();
} );