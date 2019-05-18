/**
 * push(object)                             : 배열의 끝에 요소 추가
 * pop()                                    : 배열의 끝에 있는 요소 삭제
 * unshift()                                : 배열의 앞에 요소 추가
 * shift()                                  : 배열의 앞에 있는 요소 삭제
 * splice(index, removeCount, [Object])     : 여러 개의 객체를 요소로 추가하거나 삭제
 * slice(index, copyCount)                  : 여러 개의 요소를 잘라내어 새로운 배열 객체로 만듦
 * */

var Users = [{name:'pdg', age:28}, {name:'kth', age:29}, {name:'gyj', age:30}, {name:'abc', age:25}];
console.log('Array Element length : %d', Users.length);
console.log('Users', Users);

var Users2 = Users.slice(1, 3);

console.log('after using slice() to Users2');
console.dir(Users2);

var Users3 = Users2.slice(1);

console.log('after using slice() to Users3');
console.dir(Users3);
