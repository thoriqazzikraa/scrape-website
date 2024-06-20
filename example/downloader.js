const { downloader } = require("../index.js")

// Twitter downloader
async function twitterDownloader(url) {
  const data = await downloader.twitterdl(url) // if error, change to twitterdl2
  console.log(data)
  return data
}
twitterDownloader("https://twitter.com/sapphoria_th/status/1803300713461850183?t=mlTZ031i-2vzHUrnW2sG0g&s=19")

// Instagram downloader
async function instagramDownloader(url) {
  const data = await downloader.igdl(url) // if error, change to igdl2
  console.log(data)
  return data
}
instagramDownloader("https://www.instagram.com/reel/C8M8BJ-Ad91/")

// Instagram story downloader
async function instagramStory(username) {
  const data = await downloader.igStory(username) // if error, change to igStory2
  console.log(data)
  return data
}
instagramStory("nechlophomeria")

// Facebook downloader
async function facebookDownloader(url) {
  const data = await downloader.fbdl(url)
  console.log(data)
  return data
}
facebookDownloader("https://www.facebook.com/share/r/TNJa6gmMyvkq8FpE/?mibextid=0VwfS7")

// Pinterest downloader
async function pinterestDownloader(url) {
  const data = await downloader.pindl(url)
  console.log(data)
  return data
}
pinterestDownloader("https://pin.it/6AJjwwMPr")

// Tiktok downloader
async function tiktokDownloader(url) {
  const data = await downloader.tiktokdl(url) // if error, change to tiktokdl2
  console.log(data)
  return data
}
tiktokDownloader("https://vt.tiktok.com/ZSYfbE2Ar/")

// Spotify downloader
async function spotifyDownloader(url) {
  const data = await downloader.spotify(url) // i recommended using my other module "@nechlophomeriaa/spotifydl" on NPM
  console.log(data)
  return data
}
spotifyDownloader("https://open.spotify.com/track/5BqwC9kOBbqYkzdOKeXFFk?si=MIxzvztbQqqOeaPWHvNNzw&context=spotify%3Aalbum%3A28GiIRNu9nEugqnUci3aIC")

// Threads downloader
async function threadsDownloader(url) {
  const data = await downloader.threads(url)
  console.log(data)
  return data
}
threadsDownloader("https://www.threads.net/@433/post/C8Vj9RjCjzU/?xmt=AQGzeNiQUTut7l437uo6JNnBXItuB-QoeVbUytJcdMVotA")
