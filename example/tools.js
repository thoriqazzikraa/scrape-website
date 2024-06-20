const { tools } = require("../index.js")
const fetch = require("node-fetch")
const fs = require("fs")

// upload files
// example with path
async function uploadFilesViaPath(path) {
  const filePath = path // "./folder/to/files"
  const buffer = fs.readFileSync(filePath)
  const uploadFile = await tools.uploadFile(buffer)
  console.log(uploadFile)
  return uploadFile
}
uploadFilesViaPath(__dirname + "/image/test.jpg")

// example with url
async function uploadFilesViaUrl(url) {
  const buffer = await fetch(url).then((res) => res.buffer())
  const data = await tools.uploadFile(buffer)
  console.log(data)
  return data
}
uploadFilesViaUrl("https://avatars.githubusercontent.com/thoriqazzikraa")
