// express
var express = require( 'express' );
var http    = require( 'http' );
var path    = require( 'path' );
// middleware
var bodyParser          = require( 'body-parser' );
var cookieParser        = require( 'cookie-parser' );
var static              = require( 'serve-static' );
var expressErrorHandler = require( 'express-error-handler' );
var expressSession      = require( 'express-session' );
// mongoose module
var mongoose = require( 'mongoose' );
// crypto module
var crypto = require( 'crypto' );
// expresss
var app = express();
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
// mongodb ( router code before )
var mongodbClient = require( 'mongodb' ).MongoClient;
var database;
var userSchema;
var userModel;
function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';
    console.log( 'database connect' );
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
                                      id              : {
                                          type      : String,
                                          required  : true,
                                          unique    : true,
                                          'default' : ' '
                                      },
                                      hashed_password : {
                                          type      : String,
                                          required  : true,
                                          'default' : ' '
                                      },
                                      salt            : {
                                          type     : String,
                                          required : true
                                      },
                                      name            : {
                                          type      : String,
                                          index     : 'hashed',
                                          'default' : ''
                                      },
                                      age             : {
                                          type      : Number,
                                          'default' : -1
                                      },
                                      create_at       : {
                                          type : Date, index : { unique : false }, 'default' : Date.now
                                      },
                                      update_at       : {
                                          type : Date, index : { unique : false }, 'default' : Date.now
                                      }
                                  } );
    userSchema.virtual( 'password' )
              .set( function ( password ) {
                  this._password       = password;
                  this.salt            = this.makeSalt();
                  this.hashed_password = this.encryptPassword( password );
                  console.log( 'virtual password 호출 : ', this.hashed_password );
              } )
              .get( function () {
                  return this._password;
              } );
    userSchema.method( 'encryptPassword', function ( plainText, inSalt ) {
        if ( inSalt ) {
            return crypto.createHmac( 'sha1', inSalt ).update( plainText ).digest( 'hex' );
        } else {
            return crypto.createHmac( 'sha1', this.salt ).update( plainText ).digest( 'hex' );
        }
    } );
    userSchema.method( 'makeSalt', function () {
        return Math.round( ( new Date().valueOf() * Math.random() ) ) + '';
    } );
    userSchema.method( 'authenticate', function ( plainText, inSalt, hashed_password ) {
        if ( inSalt ) {
            console.log('authenticate 호출 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
            return this.encryptPassword(plainText, inSalt) === hashed_password;
        } else {
            console.log('authenticate 호출 : %s -> %s : %s', plainText, this.encryptPassword(plainText, inSalt), hashed_password);
            return  this.encryptPassword(plainText) === this.hashed_password;
        }
    });

    userSchema.path('id').validate(function ( id ) {
        return id.length;
    }, 'id 컬럼의 값이 없습니다.');

    userSchema.path('name').validate(function ( name ) {
        return name.length;
    }, 'name 컬럼의 값이 없습니다.');

    userSchema.static('findById', function ( id, callback ) {
        return this.find({
                             id : id
                         },
                         callback);
    });

    console.log( 'userSchema 정의 완료' );
    userModel = mongoose.model( 'users3', userSchema );
    console.log( 'userModel 정의 완료' );
}
// router
var router = express.Router();
router.route( '/process/login' ).post( function ( req, res ) {
    console.log( 'login process call' );
    var paramId = req.body.id || req.query.id;
    var paramPw = req.body.password || req.query.password;
    if ( database ) {
        authUser( database, paramId, paramPw, function ( err, docs ) {
            if ( err ) {
                throw err;
            }
            if ( docs ) {
                console.dir( docs );
                var userName = docs[ 0 ].name;
                res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                res.write( '<h1>로그인 성공</h1>' );
                res.write( '<div><p>Id : ' + paramId + '</p></div>' );
                res.write( '<div><p>name : ' + userName + '</p></div>' );
                res.write( '<br><br><a href="/public/login.html">로그아웃</a>' );
                res.end();
            } else {
                res.writeHead( 200, { 'Content-Type' : 'text/html;charset=utf-8' } );
                res.write( '<h1>로그인 실패</h1>' );
                res.write( '<br><br><a href="/public/login.html">다시 로그인 하기</a>' );
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
router.route( '/process/adduser' ).post( function ( req, res ) {
    console.log( 'add user process Call' );
    var paramId   = req.body.id || req.query.id;
    var paramPw   = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;
    console.log( paramId, paramPw, paramName );
    if ( database ) {
        addUser( database, paramId, paramPw, paramName, function ( err, result ) {
            console.dir( result );
            if ( err ) {
                throw err;
            }
            if ( result ) {
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
var authUser = function ( database, id, pw, callback ) {
    console.log( 'authUser call' );
    userModel.findById(id, function ( err, results ) {
        if ( results.length > 0) {
            console.log('아이디와 일치하는 사용자 찾음');

            var user = new userModel({id : id});
            var authenticated = user.authenticate(pw, results[0]._doc.salt, results[0]._doc.hashed_password);

            if ( authenticated ) {
                console.log('비밀번호 일치');
                callback ( null,  results );
            } else {
                console.log('비밀번호 일치하지 않음');
                callback ( null,  null);
            }
        }
    });
};
var addUser  = function ( database, id, pw, name, callback ) {
    console.log( 'addUser call' );
    var user = new userModel( {
                                  id       : id,
                                  password : pw,
                                  name     : name
                              } );
    user.save( function ( err ) {
        if ( err ) {
            callback( err, null );
            return;
        }
        console.log( '사용자 추가 성공' );
        callback( null, user );
    } );
};
// server start
http.createServer( app ).listen( app.get( 'port' ), function () {
    console.log( 'Server Started Port Number : ', app.get( 'port' ) );
    connectDB();
} );




