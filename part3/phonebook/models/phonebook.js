const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
  .then(
    console.log('connected to MongoDB')
  )
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

function number_validator (val) {
  const splitattu_teksti = val.split('-')
  return (splitattu_teksti[0].length === 2 || splitattu_teksti[0].length === 3) && (!isNaN(splitattu_teksti[0])) && (!isNaN(splitattu_teksti[1]))
}

const phoneNumberSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3
  },
  number: {
    type: String,
    minLength:8,
    validate: number_validator
  }
})

phoneNumberSchema.set('toJSON', {
  transform: (document, returnObject) => {
    returnObject.id = returnObject._id.toString()
    delete returnObject._id
    delete returnObject.__v
  }
})


module.exports = mongoose.model('Number', phoneNumberSchema)