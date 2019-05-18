var Users = [{name:'pdg', age:28}, {name:'kth', age:29}];

var add = function ( a, b ) {
    return a+b;
};

Users.push(add);

console.log('User : %d', Users.length);
console.log('Third insert function call : %d', Users[2](10,20));