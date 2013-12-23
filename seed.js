db.dropDatabase();
var seedUser ={
	firstName:'Sean',
	lastName:"Connery", 
	displayName:"Sean Connery",
	password:'1',
	email:'1@1.com',
	role:'admin',
	approved: true, 
	admin: true
};
db.users.save(seedUser);
var seedUser ={
	firstName:'Doctor',
	lastName:"No", 
	displayName:"Doctor No",
	password:'2',
	email:'2@2.com',
	role:'admin',
	approved: true, 
	admin: true
};
db.users.save(seedUser);
var seedUser ={
	firstName:'Money',
	lastName:"Penny", 
	displayName:"Money Penny",
	password:'3',
	email:'3@3.com',
	role:'admin',
	approved: true, 
	admin: true
};
db.users.save(seedUser);