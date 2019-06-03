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
    });

    /**
     * var userSchema = new mongusse.Schema({
     *     id : { type : String, required : true, unique : true },
     *     password : { type : String, required : true },
     *     name : String,
     *     age : Number,
     *     create_at : Data,
     *     uadated_at : Date
     * }
     * */

    userSchema = mongoose.Schema({
        id : String,
        name : String,
        password : String
    });
    console.log('Schema Defined');

    userModel = mongoose.model("users", userSchema);
    console.log('Model Defined');

    database.on('disconnected', function () {
        console.log('database unconnected, 5초후 재연결 시도');
        setInterval(connectDB, 5000);
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
            if ( err ) throw err;
            if ( result && result.insertedCount > 0 ) {
                console.dir(result);
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




