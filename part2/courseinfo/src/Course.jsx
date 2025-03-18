const Header = (props) => <h1>{props.course}</h1>

const Content = (props) => {
  
  return (
    props.parts.map(element => <Part key={element.id} part={element} />)
)
}

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <b>Total of exercises {props.total}</b>

const Course = (props) => {
  const course = props.course
  const initial = 0
  const summation = course.parts.reduce((acc , curr) => acc + curr.exercises, initial)

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total
        total = {summation}
      />
    </div>
  )
}

export default Course