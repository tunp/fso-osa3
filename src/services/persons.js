const mongoose = require("mongoose");

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const url = process.env.MONGODB_URI;

const Schema = mongoose.Schema;
const PersonSchema = new Schema({
    name: String,
    number: String,
});
PersonSchema.statics.format = function (p) {
    if (!p) {
        p = this;
    }
    if (p && p._id) {
        return {
            name: p.name,
            number: p.number,
            id: p._id
        }
    } else {
        return undefined;
    }
}
const Person = mongoose.model('Person', PersonSchema);

const addPerson = new_person => {
    mongoose.connect(url);
    const person = new Person(new_person);
    return person.save().then(res => {
        mongoose.connection.close();
        return Person.format(res);
    });
}

const getPersons = () => {
    mongoose.connect(url);
    return Person.find({}).then(res => {
        mongoose.connection.close();
        return res.map(Person.format);
    });
}

const getPerson = id => {
    mongoose.connect(url);
    return Person.findById(id).then(res => {
        mongoose.connection.close();
        return Person.format(res);
    });
}

const getPersonByName = name => {
    mongoose.connect(url);
    return Person.find({name}).then(res => {
        mongoose.connection.close();
        if (res) {
            return Person.format(res[0]);
        } else {
            return undefined;
        }
    });
}

const deletePerson = id => {
    mongoose.connect(url);
    return Person.findByIdAndRemove(id).then(res => {
        mongoose.connection.close();
    });
}

const updatePerson = (id, person) => {
    mongoose.connect(url);
    return Person.findByIdAndUpdate(id, person, { new: true }).then(res => {
        mongoose.connection.close();
        return Person.format(res);
    });
}

module.exports = { addPerson, getPersons, getPerson, getPersonByName, deletePerson, updatePerson };
