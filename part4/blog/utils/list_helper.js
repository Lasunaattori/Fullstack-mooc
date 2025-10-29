const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.length === 0
      ? 0
      : blogs.reduce((accumulator, currentValue) => 
          accumulator + currentValue.likes,
          0
  )
}

const favoriteBlog = (blogs) => {
// Use map to pick up all likes to an array, and reduce to find index of most likes
  const max_index = blogs.map((elem) => elem.likes).reduce((index_max, elem, i, blogs) => elem > blogs[index_max] ? i : index_max,0)
  return blogs[max_index]
}

const mostBlogs = (blogs) => {

  function count_appearances(arr) {
    return arr.reduce(function(accumulator, current_value){
      // If there is no key with the current_value creates it with value 1. If key exists add 1 to its value
      accumulator[current_value.author] = accumulator[current_value.author] + 1 || 1
      return accumulator
    }, {})
  }
  const author_counts = count_appearances(blogs)
  const key_author_with_most_appearances = Object.keys(author_counts).reduce(function( accumulator, current_value){
    return author_counts[accumulator] > author_counts[current_value] ? accumulator : current_value
  })
  const author = { author:key_author_with_most_appearances, blogs:author_counts[key_author_with_most_appearances]}
  return author
}

const mostLikes = (blogs) => {
 
  function count_appearances(arr) {
    return arr.reduce(function(accumulator, current_value){
      // If there is no key with the current_value creates it with current blogs likes. If key exists add current blogs likes to value
      accumulator[current_value.author] = accumulator[current_value.author] + current_value.likes || current_value.likes
      return accumulator
    }, {})
  }
  const author_counts = count_appearances(blogs)
  const key_author_with_most_appearances = Object.keys(author_counts).reduce(function( accumulator, current_value){
    return author_counts[accumulator] > author_counts[current_value] ? accumulator : current_value
  })
  const author = { author:key_author_with_most_appearances, likes:author_counts[key_author_with_most_appearances]}
  return author
}


module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}