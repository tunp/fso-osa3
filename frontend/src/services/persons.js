import axios from 'axios';
const base_url = '/api/persons';

const addPerson = new_person => {
    return axios.post(base_url, new_person).then(response => response.data);
}

const deletePerson = id => {
    return axios.delete(`${base_url}/${id}`);
}

const modifyPerson = (id, modify_person) => {
    return axios.put(`${base_url}/${id}`, modify_person).then(response => response.data);
}

const getPersons = () => {
    return axios.get(base_url).then(response => response.data);
}

export default { addPerson, deletePerson, modifyPerson, getPersons };
