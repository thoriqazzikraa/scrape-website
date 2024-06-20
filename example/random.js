const { random } = require("../index.js")

// random pics anime
async function animePics(query) {
  if (query === "neko") {
    var data = await random.anime.neko()
  } else if (query === "waifu") {
    var data = await random.anime.waifu()
  } else if (query === "shinobu") {
    var data = await random.anime.shinobu()
  } else {
    return "Random anime picture you choose not found"
  }
  console.log(data)
  return data
}
animePics("neko")

// random gore videos
async function randomGore() {
  const data = await random.randomGore()
  console.log(data)
  return data
}
randomGore()

// get random hubble images from https://esahubble.org/images
async function hubbleImages() {
  const data = await random.hubbleImg()
  console.log(data)
  return data
}
hubbleImages()

// get random truth or dare
async function truthOrDare() {
  const data = await random.truthOrDare()
  console.log(data)
  return data
}
truthOrDare()

// get random tiktok videos from username
async function randomTiktok(username) {
  const data = await random.randomTiktok(username)
  console.log(data)
  return data
}
randomTiktok("nechlophomeria")
