const { GraphQLScalarType } = require('graphql')

module.exports = {
  User: {
    postedPhotos: parent => photos.filter(p => p.githubUser === parent.githubLogin),
    inPhotos: parent =>
      tags
        .filter(tag => tag.userId === parent.githubLogin)
        .map(tag => tag.photoID)
        .map(photoID => photos.find(photo => photo.id === photoID))
  },
  Photo: {
    // eslint-disable-next-line no-underscore-dangle
    id: parent => parent.id || parent._id,
    // eslint-disable-next-line no-underscore-dangle
    url: parent => `/images/${parent._id}.jpg`,
    postedBy: (parent, __, { db }) => db.collection('users').findOne({ githubLogin: parent.userID })
    //    taggedUsers: parent =>
    //      tags
    //        .filter(tag => tag.photoID === parent.id)
    //        .map(tag => tag.userID)
    //        .map(userID => users.find(u => u.githubLogin === userID))
  },
  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value.',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  })
}
