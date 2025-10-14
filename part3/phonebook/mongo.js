const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)

mongoose.connect(url)

const phoneNumberSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Number = mongoose.model('Number', phoneNumberSchema)


if (process.argv.length === 5) {
    const number = new Number({
        name: process.argv[3],
        number: process.argv[4]
    })
    number.save().then(result => {
        console.log(`added ${number.name} number ${number.number} to phonebook`)
        mongoose.connection.close()
      })
}

if (process.argv.length === 3) {
    console.log('phonebook:')
    Number.find({}).then(result => {
        result.forEach(number => {
            console.log(`${number.name} ${number.number}`)
        })
        mongoose.connection.close()
    })
}

