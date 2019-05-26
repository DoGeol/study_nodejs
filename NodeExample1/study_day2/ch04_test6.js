var fs = require('fs');

// 파일을 비동기식 IO로 읽어 들입니다.
var data = fs.readFile('./../package.json', 'utf-8', function ( err, test ) {
    console.log(test);
});

console.log('프로젝트 폴더 안의 package.json 파일을 읽도록 요청했습니다.');