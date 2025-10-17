import { useEffect, useState } from 'react'
import Name from './components/Name'
import FilterForm from './components/FilterForm'
import PersonForm from './components/PersonForm'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [addMessage, setAddMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(response => {
        setPersons(response)
      })
    },[])

  const Notification = ({message}) => {
    const addNotificationStyle = {
      color: 'green',
      background:'lightgreen',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }
    const removeNotificationStyle = {
      color: 'red',
      background:'coral',
      fontSize: 20,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10,
    }

    if (message === null) {
      return null
    }

    if (message.includes('has')) {
      return (
        <div style={removeNotificationStyle}>
          {message}
        </div>
      )
    } else if (message.includes('failed')) { 
      return(
        <div style={removeNotificationStyle}>
          {message}
        </div>
    )} else { 
      return(
        <div style={addNotificationStyle}>
          {message}
        </div>
    )}
  }

  const addName = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber
    }

    for (const persona of persons) {
      if (personObject.name === persona.name) {
        const idHelper = persona.id
        if (window.confirm(`${personObject.name} is already added to the phonebook, replace the old number with the new one?`)) {
          personService.update(idHelper, personObject)
            .then(response => {
              setAddMessage(
                `${personObject.name} was added to the phonebook!`
              )
              setTimeout(()=> {
                setAddMessage(null)
              },5000)
            }).catch(error => {
              setAddMessage(
                `${personObject.name} has already been removed from server`
              )
              setTimeout(()=> {
                setAddMessage(null)
              },5000)
            })
          personService
            .getAll()
            .then(response => {
              setPersons(response)
            })
          setNewName('')
          setNewNumber('')
          return
        } else {
          setNewName('')
          setNewNumber('')
          return
        }
      }
    }

    personService
      .create(personObject)
      .then(response => {
        personService
          .getAll()
          .then(response => setPersons(response))
      })
      .catch(error => {
        console.log(error.response.data.error)
        setAddMessage(error.response.data.error)
      })

    setAddMessage(
      `${personObject.name} was added to the phonebook!`
    )
    setTimeout(()=> {
      setAddMessage(null)
    },5000)

    setNewName('')
    setNewNumber('')
  }

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  console.log(persons)
  const personsToShow = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const toggleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)){
    personService
      .deletePerson(id)
      .then(response => {
      }).then(response => {
        personService
          .getAll()
          .then(response => setPersons(response))
      })
      }}

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={addMessage}/>
      <FilterForm value={newFilter} onchange={handleFilterChange}/> 
      <h2>Add a new phonenumber</h2>

      <PersonForm 
      addName={addName} 
      newName={newName} 
      handleNameChange={handleNameChange} 
      newNumber={newNumber}
      handleNumberChange={handleNumberChange}
      />

      <h2>Numbers</h2>
      <ul>
        {personsToShow.map(person => 
        <Name 
          key={person.name} 
          name={person.name} 
          number={person.number}
          deleteFunction={() => toggleDelete(person.id, person.name)}
          />
        )}
      </ul>
    </div>
  )
}

export default App