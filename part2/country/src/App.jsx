import { useEffect, useState } from "react"
import countryService from './services/countryAPI'
import weatherService from "./services/weatherAPI"

const App = () => {
  const [newFilter, setNewFilter] = useState('')
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('')
  const [countryObject, setCountryObject] = useState(null)
  const [capitalWeather, setCapitalWeather] = useState(null)
  
  console.log(country)

  useEffect(() => {
    countryService
      .getAllCountries()
      .then(response => {
        const countryList = []
        for (const country of response) {
          countryList.push(country.name.common)
        }
        setCountries(countryList)
      })
  },[])

  useEffect(() => {
    if (country) {
      countryService
      .getCountry(country)
      .then(response => {
        setCountryObject(response)
        const lat = response.capitalInfo.latlng[0]
        const long = response.capitalInfo.latlng[1]
        weatherService
        .getWeather(lat,long)
        .then(response => {
          setCapitalWeather(response)
        })
    })
  }}, [country])

  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }
  
  const countriesToShow = countries.filter(country => country.toLowerCase().includes(newFilter.toLocaleLowerCase()))

  const CountryList = ({ propcountries }) => {
    return (
      propcountries.map(country => <CountryListObject key={country} name={country}/>)
  )}

  const CountryListObject = (propcountry) => {
    return <li>{propcountry.name} <button onClick={() => {handleShow(propcountry.name)}}>Show</button> </li>
  }

  const handleShow = (countryname) => {
    setNewFilter(countryname)
  }
  
  const DisplayCountry = () => {
    if (countryObject && capitalWeather) {
      return (
        <div>
          <h1>{countryObject.name.common}</h1>
          <p>{countryObject.capital} <br></br>
          {countryObject.area}</p>
          <h2>Languages</h2>
          <ul>
            {Object.values(countryObject.languages).map(language => <li key={language}>{language}</li>)}
          </ul>
          <img src={countryObject.flags.png}></img>
          <h2>Weather in {countryObject.capital}</h2>
          <p>Temperature {(capitalWeather.main.temp - 273.15).toFixed(2)} Celsius</p>
          <img src={`https://openweathermap.org/img/wn/${capitalWeather.weather[0].icon}@2x.png`}></img>
          <p>Wind {capitalWeather.wind.speed} m/s</p>
        </div>
      )
    }
  }

  const Format = () => {
    if (countriesToShow.length > 10) {
      return (
        <p>Too many matches, please specify another filter</p>
      )
    } else if (countriesToShow.length > 1) {
      return (
        <ul>
          <CountryList propcountries={countriesToShow}/>
        </ul>
      )
    } else if (countriesToShow.length === 1) {
      useEffect(() => {
        setCountry(countriesToShow[0])
      })
      return (
        <DisplayCountry/>
      )
    } else {
      return (
        <p>No countries match given filter</p>
      )}
    }

  return (
    <div>
    <form>
      filter country: <input value={newFilter}
      onChange={handleFilterChange}/>
    </form>
    <Format/>
    </div>
  )
}

export default App