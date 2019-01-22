import express from 'express'
import { apiKey, randomOrg } from '../apiKey'
import { placesNearby } from '@google/maps'

const app = express()

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  next()
})

const googleMapsClient = require('@google/maps').createClient({
  key: apiKey,
  Promise: Promise
});

// Find restaurant in area and randomly choose one
app.get('/find/:latlng/:radius/:keyword', (req, res) => {
  console.log(req)
  googleMapsClient.placesNearby({
    location: req.params.latlng, 
    radius: parseInt(req.params.radius), 
    keyword: req.params.keyword, 
    type: 'restaurant'
  })
  .asPromise()
  .then(response => {
    const a = response.json.results
    // Add random.org api instead of math
    const result = a[Math.floor(Math.random() * a.length)]
    res.send({
      result
    })
  })
  .catch((err) => {
    console.log(err)
  })
})

app.get('/test', (req, res) => {

})



const lat = '59.3139445'
const lon = '18.0872463'
const sliderValue = '1500'

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))

export default app
