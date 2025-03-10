import axios from 'axios'
const baseUrl = 'https://api.openweathermap.org/data/2.5/weather?'
const apiKey = import.meta.env.VITE_API_KEY

const getWeather = (lat, long) => {
    console.log(apiKey)
    const request = axios.get(`${baseUrl}lat=${lat}&lon=${long}&appid=${apiKey}`)
    console.log(request)
    return request.then(response => response.data)
}

export default { getWeather }