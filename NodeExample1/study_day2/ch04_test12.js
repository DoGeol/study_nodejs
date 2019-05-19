var fs = require('fs');
var inName = './output.txt';
var outName = './output2.txt';

fs.exists(outName, function (exists) {
    if ( exists ) {
        fs.unlink(outName, function (err) {
            if ( err ) throw err;
            console.log('기존 파일 [' + outName + '] 삭제함.');
        });
    }
    var infile = fs.createReadStream(inName, {flags : 'r'});
    var outfile = fs.createWriteStream(outName, {flags : 'w'});
    infile.pipe(outfile);
    console.log('파일 복사 [' + inName + '] -> [' + outName + ']');
});