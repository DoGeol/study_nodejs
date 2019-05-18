var Person = {};

Person['age'] = 20;
Person['name'] = 'Girls Generation';
var oper = function ( a, b ) {
    return a + b;
};

Person['add'] = oper;

console.log('age : %d', Person.age);
console.log('name : %s', Person.name);
console.log('add function - 10+20 : %d', Person.add(10,20));