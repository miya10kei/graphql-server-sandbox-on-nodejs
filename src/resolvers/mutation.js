const fetch = require('node-fetch')
const { authorizeWithGithub } = require('../lib')

module.exports = {
  async postPhoto(_, args, { db, currentUser }) {
    if (!currentUser) throw new Error('only an authorized user can post a photo.')
    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date()
    }
    const { insertedIds } = await db.collection('photos').insert(newPhoto)
    newPhoto.id = insertedIds[0]
    return newPhoto
  },
  async githubAuth(_, { code }, { db }) {
    // eslint-disable-next-line camelcase
    const { message, access_token, avatar_url, login, name } = await authorizeWithGithub({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    })
    if (message) throw new Error(message)
    const latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    }
    const {
      ops: [user]
    } = await db.collection('users').replaceOne({ githubLogin: login }, latestUserInfo, { upsert: true })
    return { user, token: access_token }
  },
  async addFakeUsers(_, { count }, { db }) {
    const randomUserApi = `https://randomuser.me/api/?results=${count}`
    const { results } = await fetch(randomUserApi).then(res => res.json())
    const users = results.map(result => ({
      githubLogin: result.login.username,
      name: `${result.name.first} ${result.name.last}`,
      avatar: result.picture.thumbnail,
      githubToken: result.login.sha1
    }))
    await db.collection('users').insert(users)
    return users
  },
  async fakeUserAuth(_, { githubLogin }, { db }) {
    const user = await db.collection('users').findOne({ githubLogin })
    if (!user) throw new Error(`Cannot find user with githubLogin '${githubLogin}'`)
    return {
      token: user.githubToken,
      user
    }
  }
}
