console.dir(process.env);
console.log('OS 환경 변수의 값 : ' + process.env[OS]);
/**
 * 에러가 발생하는 이유
 * 노드의 process.env 속성에 사용자 정의 환경 변수만 들어 있기 때문
 */
