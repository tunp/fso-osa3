import React from 'react'

const NumberInputForm = ({addName, onChange, newName, newNumber}) => (
    <form onSubmit={addName}>
      <div>
        nimi: <input onChange={onChange("newName")} value={newName} name={"name"} />
      </div>
      <div>
        numero: <input onChange={onChange("newNumber")} value={newNumber} name={"number"} />
      </div>
      <div>
        <button type="submit">lisää</button>
      </div>
    </form>
)

export default NumberInputForm
