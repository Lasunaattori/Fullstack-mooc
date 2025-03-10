import { useState } from 'react'

const StatisticLine = (props) => {
  if (props.name==="positive") {
    return(      
      <tr>
        <td>{props.name}</td> 
        <td>{props.value} %</td>
      </tr>)
  }
  return(
      <tr>
        <td>{props.name}</td> 
        <td>{props.value}</td>
      </tr>
  )
}

const Statistics = (props) => {
  const average = (props.good * 1 + props.bad * -1) / props.all.length
  const positive = props.good / props.all.length * 100
  if (props.all.length === 0) {
    return (
      <div>
        No feedback given
      </div>
    )
  }
  return (
    <table>
      <tbody>
      <StatisticLine name="good" value={props.good}/>
      <StatisticLine name="neutral" value={props.neutral}/>
      <StatisticLine name="bad" value={props.bad}/>
      <StatisticLine name="average" value={average}/>
      <StatisticLine name="positive" value={positive}/>
      </tbody>
    </table>
  )
}

const Button = ({ handleClick, text }) => (
  <button onClick={handleClick}>
    {text}
  </button>
)

const App = () => {
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const [allClicks, setAll] = useState([])

  const handleGoodClick = () =>{
    setGood(good + 1)
    setAll(allClicks.concat(1))
  }

  const handleNeutralClick = () => {
    setNeutral(neutral + 1)
    setAll(allClicks.concat(0))
  }

  const handleBadClick = () => {
    setBad(bad + 1)
    setAll(allClicks.concat(-1))
  } 

  return (
    <div>
      <h1>Give feedback</h1>
      <Button handleClick={handleGoodClick} text='good' />
      <Button handleClick={handleNeutralClick} text='neutral' />
      <Button handleClick={handleBadClick} text='bad' />
      <h1>Statistics</h1>
      <Statistics all={allClicks} good={good} bad={bad} neutral={neutral} />
    </div>
  )
}

export default App