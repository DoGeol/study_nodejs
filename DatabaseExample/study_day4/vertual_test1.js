// express
var express = require( 'express');
var http = require('http');
var path = require( 'path');

// middleware
var bodyParser = require( 'body-parser');
var cookieParser = require( 'cookie-parser');
var static = require( 'serve-static');

var expressErrorHandler = require( 'express-error-handler');
var expressSession = require( 'express-session');

// mongoose module
var mongoose = require( 'mongoose');

// expresss
var app = express();
app.set('port', process.env.PORT || 3000 );

app.use(bodyParser.urlencoded( { extended : false } ));
app.use(bodyParser.json());
app.use('/public', static( path.join( __dirname, 'public' ) ));
app.use(cookieParser());

app.use(expressSession({
    secret : 'my key',
    resave : true,
    saveUninitialized : true
                       }));

// mongodb ( router code before )
var mongodbClient = require( 'mongodb').MongoClient;

var database;
var userSchema;
var userModel;

function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/local';

    console.log('database connect');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl);
    database = mongoose.connection;

    database.on('error', console.error.bind( console, 'mongoose connection error'));
    database.on('open', function () {
        console.log('database connected : ',databaseUrl);

        createUserSchema();

        doTest();

    });

    database.on('disconnected', function () {
        console.log('database unconnected, 5초후 재연결 시도');
        setInterval(connectDB, 5000);
    });
}

function createUserSchema() {
    userSchema = mongoose.Schema({
         id : {
             type : String,
             required : true,
             unique : true
         },
         name : {
             type : String,
             index : 'hashed',
             'default' : ''
         },
         age : {
             type : Number,
             'default' : -1
         },
         create_at : {
             type : Date,  index : { unique : false }, 'default' : Date.now
         },
         update_at : {
             type : Date,  index : { unique : false }, 'default' : Date.now
         }
     });

    userSchema.virtual('info')
              .set(function ( info ) {
                  var infoArray = info.split(' ');
                  this.id = infoArray[0];
                  this.name = infoArray[1];
                  console.log('virtual info 설정 : ', this.id, this.name);
              })
              .get(function () {
                  return this.id + ' ' + this.name
              });

    console.log('userSchema 정의 완료');

    userModel = mongoose.model("users4", userSchema);
    console.log('userModel 정의 완료');
}

function doTest() {
    var user = new userModel({
                                 info : 'test02 비질란테2'
                             });

    user.save(function ( err ) {
        if(err) throw err;
        console.log("사용자 데이터 추가");
        findAll();
    });

    console.log('info 속성에 값 할당');
    console.log('id : ', user.id, ', name : ', user.name);
}

function findAll() {
    userModel.find({}, function ( err, results ) {
        if(err) throw err;
        if ( results ) {
            console.log('조회 된 user 문서 객체 #0 -> id : ', results[0]._doc.id, ' name : ', results[1]._doc.name);
        }
    });
}

// router
var router = express.Router();
router.route('/process/login').post(function ( req, res ) {
    console.log('login process call');

    var paramId = req.body.id || req.query.id;
    var paramPw = req.body.password || req.query.password;

    if ( database ) {
        authUser( database, paramId, paramPw, function ( err, docs ) {
            if ( err ) throw err;
            if ( docs ) {
                console.dir(docs);
                var userName = docs[0].name;
                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
                res.write('<h1>로그인 성공</h1>');
                res.write('<div><p>Id : '+ paramId +'</p></div>');
                res.write('<div><p>name : '+ userName +'</p></div>');
                res.write('<br><br><a href="/public/login.html">로그아웃</a>');
                res.end();
            } else {
                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
                res.write('<h1>로그인 실패</h1>');
                res.write('<br><br><a href="/public/login.html">다시 로그인 하기</a>');
                res.end();
            }
        })
    } else {
        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
        res.write('<h1>Database 연결 실패</h1>');
        res.write('<div><p>연결 못했쑴</p></div>');
        res.end();
    }

});

router.route('/process/adduser').post(function ( req, res ) {
    console.log('add user process Call');
    
    var paramId = req.body.id || req.query.id;
    var paramPw = req.body.password || req.query.password;
    var paramName = req.body.name || req.query.name;

    console.log(paramId, paramPw, paramName);
    
    if ( database ) {
        addUser( database, paramId, paramPw, paramName, function ( err, result ) {
            console.dir( result );
            if ( err ) throw err;
            if ( result ) {
                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
                res.write('<h1>User 추가 성공</h1>');
                res.write('<br><br><a href="/public/login.html">로그인 화면</a>');
                res.end();
            } else {
                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
                res.write('<h1 style="color : red;">User 추가 실패</h1>');
                res.write('<br><br><a href="/public/login.html">로그인 화면</a>');
                res.end();
            }
        });
    } else {
        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
        res.write('<h1>Database 연결 실패</h1>');
        res.write('<div><p>연결 못했쑴</p></div>');
        res.end();
    }
    

});

router.route('/process/listuser').post(function ( req, res ) {
    console.log('/process/listuser 호출');

    if ( database ) {
        userModel.findAll(function ( err, results ) {
            if ( err ) {
                console.error('사용자 리스트 조회 중 오류 발생 : ', err.stack);
                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
                res.write('<h1>사용자 리스트 조회 중 오류 발생</h1>');
                res.write('<div><p>' + 'err.stack' + '</p></div>');
                res.end();
                return;
            }

            if(results) {
                console.dir(results);
                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
                res.write('<h1>사용자 리스트</h1>');
                res.write('<div><ul>');

                for ( var i=0; i<results.length; i++) {
                    var curId = results[i]._doc.id;
                    var curName = results[i]._doc.name;
                    res.write(' <li>#' + i + ' : ' + curId + ', ' + curName + '</li>');
                }
                res.write('</ul></div>');
                res.end();
            } else {
                res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
                res.write('<h1>사용자 리스트 조회 실패</h1>');
                res.end();
            }
        });
    } else {
        res.writeHead(200, {'Content-Type' : 'text/html;charset=utf-8'});
        res.write('<h1>Database 연결 실패</h1>');
        res.write('<div><p>연결 못했쑴</p></div>');
        res.end();
    }
});

app.use('/', router);

// error handler
var errorHandler = expressErrorHandler({
    static : {
        '404' : './public/404.html'
    }
                                       });

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

//FixME User Author Logic
var authUser = function ( database, id, pw, callback ) {
    console.log('authUser call');

    userModel.find({
        id : id,
        password : pw
                   }, function ( err, result ) {
        if ( err ) {
            callback ( err,  null);
            return;
        }
        console.log('아이디 : [%s], 패스워드 [%s]로 검색 결과 : ', id, pw);
        console.dir(result);

        if ( result.length > 0 ) {
            console.log('일치하는 사용자 : ', id, pw);
            callback ( null, result );
        } else {
            console.log('일치하는 사용자 없음');
            callback ( null, null );
        }
    });
};

var addUser = function ( database, id, pw, name, callback ) {
    console.log('addUser call');

    var user = new userModel({
        id : id,
        password : pw,
        name : name
    });

    user.save(function ( err ) {
        if ( err ) {
            callback ( err, null );
            return;
        }
        console.log('사용자 추가 성공');
        callback ( null, user );
    });
};

// server start
http.createServer(app).listen(app.get('port'), function () {
    console.log('Server Started Port Number : ', app.get('port'));
    connectDB();
});




