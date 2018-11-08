import React from 'react';
import Filter from './components/Filter';
import NumberInputForm from './components/NumberInputForm';
import NumberRow from './components/NumberRow';
import Message from './components/Message';
import PersonService from './services/persons.js';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      persons: [
      ],
      newName: '',
      newNumber: '',
      filter: ''
    }
  }
    onChange = key => e => {
        this.setState({[key]: e.target.value})
    }

    addPerson = e => {
        e.preventDefault();
        const new_name = e.target.name.value
        const new_number = e.target.number.value
        const persons = this.state.persons
        let found_persons;
        if ((found_persons = persons.find(person => person.name === new_name))) {
            if (window.confirm(`${new_name} on jo luettelossa, korvataanko vanha numero uudella?`)) {
                const modify_person = { name: new_name, number: new_number }
                const id = found_persons.id;
                PersonService.modifyPerson(id, modify_person).then(modified_person => {
                    const new_state = {
                        newName: '',
                        newNumber: '',
                        persons: persons.map(person => person.id === id ? modified_person : person ),
                        msg: 'Numero korvattiin',
                        msg_type: 'success'
                    }
                    this.setState(new_state);
                    setTimeout(() => {
                        this.setState({msg: undefined, msg_type: undefined});
                    }, 2000);
                }).catch(error => {
                    if (error.response.status === 404) {
                        const new_state = {
                            msg: 'Henkilön tietoja ei löytynyt enää palvelimelta',
                            msg_type: 'fail'
                        }
                        this.setState(new_state);
                        setTimeout(() => {
                            this.setState({msg: undefined, msg_type: undefined});
                        }, 2000);
                    }
                });
            }
        } else {
            const new_person = { name: new_name, number: new_number }
            PersonService.addPerson(new_person).then(added_person => {
                const new_state = {
                    newName: '',
                    newNumber: '',
                    persons: persons.concat(added_person),
                    msg: 'Henkilö lisättiin',
                    msg_type: 'success'
                }
                this.setState(new_state);
                setTimeout(() => {
                    this.setState({msg: undefined, msg_type: undefined});
                }, 2000);
            });
        }
    }

    deletePerson = id => e => {
        if (window.confirm("Haluatko varmasti poistaa henkilön?")) {
            PersonService.deletePerson(id).then(() => {
                const new_state = {
                    persons: this.state.persons.filter(person => person.id !== id),
                    msg: 'Henkilö poistettiin',
                    msg_type: 'success'
                }
                this.setState(new_state);
                setTimeout(() => {
                    this.setState({msg: undefined, msg_type: undefined});
                }, 2000);
            }).catch(error => {
                if (error.response.status === 404) {
                    const new_state = {
                        msg: 'Henkilön tietoja ei löytynyt enää palvelimelta',
                        msg_type: 'fail'
                    }
                    this.setState(new_state);
                    setTimeout(() => {
                        this.setState({msg: undefined, msg_type: undefined});
                    }, 2000);
                }
            });
        }
    }

    componentDidMount() {
        PersonService.getPersons().then(persons => {
            this.setState({persons});
        })
    }

  render() {
      const filtered_persons = this.state.filter.length ? this.state.persons.filter(person => person.name.indexOf(this.state.filter) !== -1) : this.state.persons;
      const person_els = filtered_persons.map(person => <NumberRow key={person.id} person={person} deletePerson={this.deletePerson(person.id)} />)
      const msg = this.state.msg ? (<Message msg={this.state.msg} type={this.state.msg_type} />) : undefined;
    return (
      <div>
        <h2>Puhelinluettelo</h2>
        {msg}
        <Filter onChange={this.onChange} value={this.state.filter} />
        <h2>Lisää uusi</h2>
            <NumberInputForm addName={this.addPerson} onChange={this.onChange} newName={this.state.newName} newNumber={this.state.newNumber} />
        <h2>Numerot</h2>
        <table>
            <tbody>
                {person_els}
            </tbody>
        </table>
      </div>
    )
  }
}

export default App
