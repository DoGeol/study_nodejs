var Person = {
    age : 20,
    name : 'Girls Generation',
    add : function ( a, b ) {
        return a + b;
    }
};


console.log('age : %d', Person.age);
console.log('name : %s', Person.name);
console.log('add function - 10+20 : %d', Person.add(10,20));