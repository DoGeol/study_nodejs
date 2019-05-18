/**
 * push(object)                             : 배열의 끝에 요소 추가
 * pop()                                    : 배열의 끝에 있는 요소 삭제
 * unshift()                                : 배열의 앞에 요소 추가
 * shift()                                  : 배열의 앞에 있는 요소 삭제
 * splice(index, removeCount, [Object])     : 여러 개의 객체를 요소로 추가하거나 삭제
 * slice(index, copyCount)                  : 여러 개의 요소를 잘라내어 새로운 배열 객체로 만듦
 * */

var Users = [{name:'pdg', age:28}, {name:'kth', age:29}, {name:'gyj', age:30}];
console.log('using delete before element length : %d', Users.length);

delete Users[1];
console.log('using delete before element');
console.dir(Users);


Users.splice(1, 0, {name:'abc', age:25});
console.log('after using splice() insert element in index-1');
console.dir(Users);

Users.splice(2, 1);
console.log('after using splice() delete element in index-2 ');
console.dir(Users);
