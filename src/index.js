const id = 0
const users = [
  { githubLogin: 'mHattrup', name: 'Mike Hattrup' },
  { githubLogin: 'gPlake', name: 'Glen Plake' },
  { githubLogin: 'sSchmidt', name: 'Scot Scmidt' }
]
const photos = [
  {
    id: '1',
    name: 'Dropping the Heart Chute',
    description: 'The heart chute is one of my favorite chutes',
    category: 'ACTION',
    githubUser: 'gPlake',
    created: '3-28-1977'
  },
  {
    id: '2',
    name: 'Enjoying the sunshine',
    category: 'SELFIE',
    githubUser: 'sSchmidt',
    created: '1-21-1985'
  },
  {
    id: '2',
    name: 'Gunbarrel 25',
    description: '25 laps on gumbarrel today',
    category: 'LANDSCAPE',
    githubUser: 'sSchmidt',
    created: '2018-04-15T19:09:57.308Z'
  }
]
const tags = [
  { photoID: '1', userID: 'sSchmidt' },
  { photoID: '2', userID: 'gPlake' },
  { photoID: '3', userID: 'mHattrup' },
  { photoID: '4', userID: 'gPlake' }
]

const { ApolloServer } = require('apollo-server-express')
const express = require('express')
const expressPloayground = require('graphql-playground-middleware-express').default
const { readFileSync } = require('fs')

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const { MongoClient } = require('mongodb')
const resolvers = require('./resolvers')

require('dotenv').config()

async function start() {
  const app = express()
  const MONGO_DB = process.env.DB_HOST
  const USER = process.env.DB_USER
  const PASSWORD = process.env.DB_PASSWORD

  const client = await MongoClient.connect(MONGO_DB, {
    auth: {
      user: USER,
      password: PASSWORD
    },
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  const db = client.db()
  const context = { db }
  const server = new ApolloServer({ typeDefs, resolvers, context })
  server.applyMiddleware({ app })
  app.get('/', (_, res) => res.end('Welcom to the PhotoShare API'))
  app.get('/playground', expressPloayground({ endpoint: '/graphql' }))
  // eslint-disable-next-line no-console
  app.listen({ port: 4000 }, () => console.log(`GraphQL Service running on http://localhost:4000${server.graphqlPath}`))
}

start()
