module.exports = {
  postPhoto(_, args) {
    const newPhoto = {
      id: id + 1,
      ...args.input,
      created: new Date()
    }
    photos.push(newPhoto)
    return newPhoto
  }
}
