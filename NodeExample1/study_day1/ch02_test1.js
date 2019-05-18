var result = 0;

console.time('duration_sum');

for ( var i=1; i <= 1000; i++ ){
    result += i;
}

console.timeEnd('duration_sum');
console.log('1부터 1000 까지 더한 결과물 : %d', result);

// __filename, __dirname은 전역변수
console.log('현재 실행한 파일의 이름 : %s', __filename);
console.log('현재 실행한 파일의 이름 : %s', __dirname);

// console.dir 은 객체 안에 들어가있는 모든 속성이 콘솔에 출력
var Person = {name:"소녀시대", age:20};
console.dir(Person);
