const express = require('express')
const app  = express()
const morgan = require('morgan')

let persons = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json())
app.use(express.static('dist'))
morgan.token('personName', function(req, res) { return req.body.name})
morgan.token('number', function(req, res) { return req.body.number})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms {"name":":personName", "number":":number"}'))

app.post('/api/persons', (request, response) => {
    const body = request.body
    const newid = String(Math.floor(Math.random()*99999))

    if (!body.name || !body.number) {
        return response.status(404).json({
            error: 'content missing'
        })
    }

    const person = {
        id: newid,
        name: body.name,
        number: body.number,
    }
    
    persons = persons.concat(person)
    response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }

  })

app.delete('/api/persons/:id', (request, response) => {
    const id = request.params.id
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()

})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/info', (request, response) => {
    const date = new Date()
    response.send(`<div> <p>Phonebook has info for ${persons.length} people</p> <p> ${date}</p> </div>`)
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log`Server running on port ${PORT}`
})
