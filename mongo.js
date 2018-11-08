const mongoose = require("mongoose");
const dbcr = require("./dbcr");

const url = `mongodb://${dbcr.user}:${dbcr.pw}@ds245971.mlab.com:45971/fullstack-persons-2`;
mongoose.connect(url);

const Person = mongoose.model('Person', {
	name: String,
	number: String
});

if (process.argv.length == 4) {
	const person = new Person({
		name: process.argv[2],
		number: process.argv[3]
	})
	person.save().then(res => {
		console.log(`lisättiin henkilö ${person.name} numero ${person.number} luetteloon`);
		mongoose.connection.close();
	});
} else {
	Person.find({}).then(res => {
		console.log("puhelinluettelo:");
		res.forEach(person => {
			console.log(person.name, person.number);
		});
		mongoose.connection.close();
	});
}
