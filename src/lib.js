const fetch = require('node-fetch')

const requestGithubToken = credential =>
  fetch(`${process.env.GITHUB_OAUTH_URL}/login/oauth/access_token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credential)
  })
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error))
    })

const requestGithubUserAcccount = token =>
  fetch(`${process.env.GITHUB_API_URL}/user`, { headers: { Authorization: `token ${token}` } })
    .then(res => res.json())
    .catch(error => {
      throw new Error(error)
    })

const authorizeWithGithub = async credential => {
  // eslint-disable-next-line camelcase
  const { access_token } = await requestGithubToken(credential)
  const githubUser = await requestGithubUserAcccount(access_token)
  return { ...githubUser, access_token }
}

module.exports = { authorizeWithGithub }
