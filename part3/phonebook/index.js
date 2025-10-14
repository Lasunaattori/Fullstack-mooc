require('dotenv').config()
const express = require('express')
const Number = require('./models/phonebook')
const morgan = require('morgan')

const app  = express()


app.use(express.json())
app.use(express.static('dist'))
morgan.token('personName', function(req, res) { return req.body.name})
morgan.token('number', function(req, res) { return req.body.number})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms {"name":":personName", "number":":number"}'))

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    
    if (!body.name || !body.number) {
        return response.status(404).json({
            error: 'content missing'
        })
    }
    const person = new Number({
        name: body.name,
        number: body.number,
    })
    
    person.save().then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    console.log(id, request.body.number)

    Number.findByIdAndUpdate(id, { number: request.body.number })
    .then(result => {
      response.json(result)
      response.status(200).end()
    })
    .catch(error => next(error))
  })

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    Number.findById(id)
    .then(result => {
      response.json(result)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Number.findByIdAndDelete(request.params.id)
    .then(result => {
        response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response) => {
    Number.find({}).then(numbers => {
      response.json(numbers)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    const date = new Date()
    Number.countDocuments().then(number_count => {
      response.send(`<div> <p>Phonebook has info for ${number_count} people</p> <p> ${date}</p> </div>`)
    })
    .catch(error => next(error))
})



const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log`Server running on port ${PORT}`
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)