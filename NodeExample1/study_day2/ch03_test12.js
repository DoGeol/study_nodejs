/**
 * push(object)                             : 배열의 끝에 요소 추가
 * pop()                                    : 배열의 끝에 있는 요소 삭제
 * unshift()                                : 배열의 앞에 요소 추가
 * shift()                                  : 배열의 앞에 있는 요소 삭제
 * splice(index, removeCount, [Object])     : 여러 개의 객체를 요소로 추가하거나 삭제
 * slice(index, copyCount)                  : 여러 개의 요소를 잘라내어 새로운 배열 객체로 만듦
 * */

var Users = [{name:'pdg', age:28}, {name:'kth', age:29}];
console.log('unshift() before element length : %d', Users.length);

Users.unshift ( {name:'gyj', age:30} );
console.log('unshift() after element length : %d', Users.length);

Users.shift();
console.log('shift() after element length : %d', Users.length);

