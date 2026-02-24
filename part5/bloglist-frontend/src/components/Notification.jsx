const Notification = ({ message }) => {
  if (!message) {
    return null
  }
  console.log(message)
  if (message.substring(0,5) === 'Error') {
    return <div className="error">{message}</div>
  } else {
    return <div className="success">{message}</div>
  }
}

export default Notification