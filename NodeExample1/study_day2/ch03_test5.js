var Person = {};

Person['age'] = 20;
Person['name'] = 'Girls Generation';
Person.add = function ( a, b ) {
    return a + b;
};

console.log('age : %d', Person.age);
console.log('name : %s', Person.name);
console.log('add function - 10+20 : %d', Person.add(10,20));