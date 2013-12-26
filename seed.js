var projs = [];
db.dropDatabase();
var seedUser ={
	firstName:'Sean',
	lastName:"Connery", 
	displayName:"Sean Connery",
	password:'1',
	email:'1@1.com',
	role:'admin',
	approved: true,
	photoUrl: '/img/sean.jpeg',
	admin: true
};
db.users.save(seedUser);
seedUser ={
	firstName:'Doctor',
	lastName:"No", 
	displayName:"Doctor No",
	password:'2',
	email:'2@2.com',
	role:'ux',
	approved: true, 
	photoUrl: '/img/drno.jpg',
	admin: true
};
db.users.save(seedUser);
seedUser ={
	firstName:'Money',
	lastName:"Penny", 
	displayName:"Money Penny",
	password:'3',
	email:'3@3.com',
	role:'developer',
	approved: true, 
	photoUrl: '/img/moneypenny.png',
	admin: true
};
db.users.save(seedUser);
seedUser ={
	firstName:'Pussy',
	lastName:"Galore", 
	displayName:"Pussy Galore",
	password:'4',
	email:'4@4.com',
	role:'design',
	approved: true, 
	photoUrl: '/img/pussygalore.jpeg',
	admin: true
};
db.users.save(seedUser);

var project = {
	"title" : "Bench",
	"text" : null,
	"url" : null,
	"updated" : ISODate("2013-12-24T21:24:20.593Z"),
	"created" : ISODate("2013-12-24T21:24:20.593Z"),
	"author" : {
		"id" : ObjectId("52b9b89a0236e14a4581a25f"),
		"name" : "Sean Connery"
	},
	"likes" : [ ],
	"watches" : [ ],
	"allocations" : [ ],
	"comments" : [ ],
};
db.project.save(project);

project = {
	"title" : "Amex",
	"text" : null,
	"url" : null,
	"updated" : ISODate("2013-12-24T21:24:20.593Z"),
	"created" : ISODate("2013-12-24T21:24:20.593Z"),
	"author" : {
		"id" : ObjectId("52b9b89a0236e14a4581a25f"),
		"name" : "Sean Connery"
	},
	"likes" : [ ],
	"watches" : [ ],
	"allocations" : [],
	"comments" : [ ],
}

db.project.save(project);

cursor = db.users.find();

var projs = [];
while ( cursor.hasNext() ) {
   projs.push(  cursor.next() );
}
// projs.forEach(printjson);	

db.project.findAndModify( {
    query: { title: "Bench" },
    sort: { rating: 1 },
    update: { $set: { allocation: projs } }
} )

cursor = db.project.find();
while ( cursor.hasNext() ) {
   projs.push(  cursor.next() );
}
// projs.forEach(printjson);	

