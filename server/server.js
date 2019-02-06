import express from 'express'
import { apiKey, randomOrg } from '../apiKey'
import bodyParser from 'body-parser'
import { resolve } from 'path'
import uuid from 'uuid/v4'

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

const googleMapsClient = require('@google/maps').createClient({
  key: apiKey,
  Promise: Promise
});

// Find restaurant in area and randomly choose one
app.post('/find/:latlng', (req, res) => {
  const keyword = req.body.keywords[Math.floor(Math.random() * req.body.keywords.length)]
  googleMapsClient.placesNearby({
    location: req.params.latlng,
    radius: req.body.radius,
    keyword,
    type: 'restaurant'
  }).asPromise().then(async (response) => {
    const a = response.json.results
    // Add random.org api instead of math
    const result = a[Math.floor(Math.random() * a.length)]
    const details = await getDetailedInfo(result.place_id)
    res.send({
      details
    })
  }).catch(e => {
    res.send({
      e
    })
  })
})

const getDetailedInfo = async (id) => {
  return googleMapsClient.place({
    placeid: id
  }).asPromise().then(res => {
    return res.json
  }).catch((e) => {
    return e
  })
}

// Deprecated
// app.post('/directions', (req, res) => {
//   // Mode optional, valid values:'driving', 'walking', 'bicycling', 'transit'
//   googleMapsClient.directions({
//     origin: req.body.origin,
//     destination: req.body.destination,
//     mode: req.body.mode ? req.body.mode : 'walking'
//   }).asPromise().then(async (directions) => {
//     const json = Object.assign(directions.json, {rrId: uuid()})
//     res.send({
//       json
//     })
//   }).catch(e => {
//     console.log(e)
//   })
// })

const port = process.env.PORT || 5000
app.listen(port, () => console.log(`Server running on port ${port}`))

export default app
