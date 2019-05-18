var Users = [{name:'pdg', age:28}, {name:'kth', age:29}, {name:'gyj', age:30}];

console.log('User : %d', Users.length);

for ( var i = 0; i < Users.length; i++){
    console.log('Array Element #' + i + ' : %s', Users[i].name);
}

console.log('\nforEach Useing');
Users.forEach(function (item, index) {
    console.log('Array Element #' + index + ' : %s', item.name);
});