import React from 'react';

const NumberRow = ({person, deletePerson}) => (
    <tr>
        <td>{person.name}</td>
        <td>{person.number}</td>
        <td><button onClick={deletePerson}>Poista</button></td>
    </tr>
)

export default NumberRow;
