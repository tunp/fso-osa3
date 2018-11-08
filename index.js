const express = require('express')
const app = express()
const body_parser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const persons = require('./src/services/persons');

morgan.token('body', (req, res) => JSON.stringify(req.body));

app.use(body_parser.json());
app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'));
app.use(cors());
app.use(express.static('frontend/build'))

app.get('/api/persons', (req, res) => {
    persons.getPersons().then(persons => {res.json(persons)});
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons.getPerson(id).then(person => {
        if (person) {
            res.json(person);
        } else {
            res.status(404).end();
        }
    }).catch(error => {
        console.log(error);
    });
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    persons.deletePerson(id).then(() => {
        res.status(204).end();
    }).catch(error => {
        console.log(error);
    });
})

app.put('/api/persons/:id', (req, res) => {
    const id = req.params.id;
    const person = req.body;
    if (!person.name) {
        return res.status(400).json({error: 'name is missing'})
    } else if (!person.number) {
        return res.status(400).json({error: 'number is missing'})
    } else {
        persons.getPersonByName(person.name).then(old_person => {
            if (old_person && old_person.id != id) {
                res.status(400).json({error: 'name must be unique'})
            } else {
                persons.updatePerson(id, person).then(new_person => res.json(new_person));
            }
        })
    }
})

app.post('/api/persons', (req, res) => {
    const person = req.body;
    if (!person.name) {
        return res.status(400).json({error: 'name is missing'})
    } else if (!person.number) {
        return res.status(400).json({error: 'number is missing'})
    } else {
        persons.getPersonByName(person.name).then(old_person => {
            if (old_person) {
                res.status(400).json({error: 'name must be unique'})
            } else {
                persons.addPerson(person).then(new_person => res.json(new_person));
            }
        })
    }
})

app.get('/info', (req, res) => {
    persons.getPersons().then(persons => {
        let content = 'puhelinluettelossa ' + persons.length + ' henkilön tiedot';
        content += '<br>';
        content += new Date().toString();
        res.send(content);
    });
})

const port = process.env.PORT || 3001;

app.listen(port, () => console.log(`backend is running @ port ${port}`));
