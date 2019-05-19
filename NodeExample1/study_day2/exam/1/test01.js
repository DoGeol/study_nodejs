var fs = require('fs');
var filePath = './info.txt';

var file = fs.createReadStream(filePath, {flags : 'r'});

file.on('data', function (data) {
    console.log('@@@@@@@@@@@@ File Read Start @@@@@@@@@@@@');
    var lineArray = data.toString('utf8').split('\n');
    for ( var lineIndex in lineArray ){
        console.log(lineArray[lineIndex].split(' ')[0]);
    }
});

file.on('end', function () {
    console.log('@@@@@@@@@@@@ File Read End @@@@@@@@@@@@');
});