import React from 'react'

const Filter = ({onChange, value}) => (
    <span>rajaa näytettäviä <input onChange={onChange("filter")} value={value} /></span>
)

export default Filter
