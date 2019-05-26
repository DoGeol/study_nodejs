var http = require('http');

var options = {
    host : 'www.google.com',
    post : 80,
    method : 'POST',
    path : '/',
    headers : {}
};

var resData = '';
var req = http.request(options, function (res) {

    res.on('data', function (chunk) {
        resData += chunk;
    });

    res.on('end', function () {
        console.log(resData);
    });

});

options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
// 요청 파라미터 설정
req.data = 'q=actor';
options.headers['Content-Length'] = req.data.length;

req.on('error', function (err) {
    console.log("Error 발생 : ", err.message);
});

req.write(req.data);
req.end();