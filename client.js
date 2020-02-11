const fetch = require('node-fetch')

const query = '{totalUsers, totalPhotos}'
const url = 'http://localhost:4000/graphql'

const opts = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ query })
}

fetch(url, opts)
  .then(res => res.json())
  .then(console.log)
  .catch(console.err)
