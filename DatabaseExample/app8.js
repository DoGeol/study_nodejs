// express
var express             = require( 'express' );
var http                = require( 'http' );
var path                = require( 'path' );
// middleware
var bodyParser          = require( 'body-parser' );
var cookieParser        = require( 'cookie-parser' );
var static              = require( 'serve-static' );
var expressErrorHandler = require( 'express-error-handler' );
var expressSession      = require( 'express-session' );
// mysql module
var mysql               = require( 'mysql' );
// connection pool
var pool                = mysql.createPool( {
                                                connectionLimit : 10,
                                                host            : 'localhost',
                                                user            : '',
                                                password        : '',
                                                database        : 'node_test',
                                                debug           : false
                                            } );
// expresss
var app                 = express();
app.set( 'port', process.env.PORT || 3000 );
app.use( bodyParser.urlencoded( { extended : false } ) );
app.use( bodyParser.json() );
app.use( '/public', static( path.join( __dirname, 'public' ) ) );
app.use( cookieParser() );
app.use( expressSession( {
                             secret            : 'my key',
                             resave            : true,
                             saveUninitialized : true
                         } ) );
// router
var router = express.Router();
router.route( '/process/login' ).post( function ( req, res ) {
    console.log( 'login process call' );
    var paramId = req.body.id || req.query.id;
    var paramPw = req.body.password || req.query.password;
    if (pool) {
        authUser(paramId, paramPw, function ( err, rows ) {
            if ( err ) {
                console.error( '사용자 로그인 중 오류 발생 : ', err.stack );
                res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                res.write( '<h1>사용자 로그인 중 오류 발생</h1>' );
                res.write( '<p>' + err.stack + '</p>' );
                res.end();
                return;
            }
            if ( rows ) {
                console.dir(rows);
                var userName = rows[0].name;
                res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                res.write( '<h1>로그인 성공</h1>' );
                res.write( '<div><p>Id : ' + paramId + '</p></div>' );
                res.write( '<div><p>name : ' + userName + '</p></div>' );
                res.write( '<br><br><a href="/public/login.html">로그아웃</a>' );
                res.end();
            } else {
                res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                res.write( '<h1 style="color : red;"> 로그인 실패</h1>' );
                res.write( '<br><br><a href="/public/login.html">로그인 화면</a>' );
                res.end();
            }
        })
    } else {
        res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
        res.write( '<h1>Database 연결 실패</h1>' );
        res.write( '<div><p>연결 못했쑴</p></div>' );
        res.end();
    }
} );
router.route( '/process/adduser' ).post( function ( req, res ) {
    console.log( 'add user process Call' );
    var paramId   = req.body.id || req.query.id;
    var paramPw   = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    var paramAge  = req.body.age || req.query.age;
    console.log( paramId, paramPw, paramName, paramAge );
    if ( pool ) {
        addUser( paramId, paramName, paramAge, paramPw, function ( err, addedUser ) {
            if ( err ) {
                console.error( '사용자 추가 중 오류 발생 : ', err.stack );
                res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                res.write( '<h1>사용자 추가 중 오류 발생</h1>' );
                res.write( '<p>' + err.stack + '</p>' );
                res.end();
                return;
            }
            if ( addedUser ) {
                console.dir( addedUser );
                console.log( 'inserted ' + addedUser.affectedRows + ' rows' );
                var insertId = addedUser.insertId;
                console.log( '추가한 레코드 아이디 : ', insertId );
                res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                res.write( '<h1>User 추가 성공</h1>' );
                res.write( '<br><br><a href="/public/login.html">로그인 화면</a>' );
                res.end();
            } else {
                res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                res.write( '<h1 style="color : red;">User 추가 실패</h1>' );
                res.write( '<br><br><a href="/public/login.html">로그인 화면</a>' );
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
// error handler
var errorHandler = expressErrorHandler( {
                                            static : {
                                                '404' : './public/404.html'
                                            }
                                        } );
app.use( expressErrorHandler.httpError( 404 ) );
app.use( errorHandler );
//FixME User Author Logic
var authUser = function ( id, pw, callback ) {
    console.log( 'authUser call' );
    pool.getConnection( function ( err, conn ) {
        if ( err ) {
            if ( conn ) {
                conn.release();
            }
            callback( err, null );
            return;
        }
        console.log( '데이터베이스 연결 스레드 아이디 : ', conn.threadId );
        var columns   = [ 'id', 'name', 'age' ];
        var tableName = 'users';
        var exec = conn.query( 'select ?? from ?? where id = ? and password = ?',
                               [ columns, tableName, id, pw ], function ( err, rows ) {
                conn.release();
                console.log( '실행 대상 SQL : ', exec.sql );
                if ( rows.length > 0 ) {
                    console.log( '아이디 [%s], 패스워드 [%s]가 일치하는 사용자 찾음', id, pw );
                    callback( null, rows );
                } else {
                    console.log( '일치하는 사용자를 찾지 못함' );
                    callback( null, null );
                }
            } );
    } );
};
var addUser  = function ( id, name, age, pw, callback ) {
    console.log( 'addUser call' );
    pool.getConnection( function ( err, conn ) {
        if ( err ) {
            if ( conn ) {
                conn.release();
            }
            callback( err, null );
            return;
        }
        console.log( '데이터베이스 연결 스레드 아이디 : ', conn.threadId );
        var data = { id : id, name : name, age : age, password : pw };
        var exec = conn.query( 'insert into users set ?', data, function ( err, result ) {
            conn.release();
            console.log( '실행 대상 SQL : ' + exec.sql );
            if ( err ) {
                console.log( 'SQL 실행 시 오류 발생' );
                console.dir( err );
                callback( err, null );
                return;
            }
            callback( null, result );
        } );
    } );
};
// server start
http.createServer( app ).listen( app.get( 'port' ), function () {
    console.log( 'Server Started Port Number : ', app.get( 'port' ) );
} );




