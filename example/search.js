const { search } = require("../index.js")

// Search / stalking tiktok user profile
async function tiktokProfile(username) {
  const data = await search.tiktokStalk(username)
  console.log(data)
  return data
}
tiktokProfile("nechlophomeria")

// Jadwal tv
async function jadwalTv(tv) {
  const data = await search.jadwalTv(tv)
  console.log(data)
  return data
}
jadwalTv("mnctv")

// Search similar songs
async function similarSongs(songs) {
  const data = await search.similarSongs(songs)
  console.log(data)
  return data
}
similarSongs("summer salt fire flower")

// Find songs by lyrics
async function findSongsByLyrics(lyrics) {
  const data = await search.findSongs(lyrics)
  console.log(data)
  return data
}
findSongsByLyrics("always reminded of the days when you were my cherry lime")

// search lyrics from title of the songs
async function searchLyrics(query) {
  const data = await search.lyrics(query) // if error, change to lyrics2
  console.log(data)
  return data
}
searchLyrics("summer salt fire flower")

// search similar bands
async function similarBands(bands) {
  const data = await search.similarBand(bands)
  console.log(data)
  return data
}
similarBands("jannabi")

// search / stalk instagram profile
async function instagramProfile(username) {
  const data = await search.igStalk2(username) // if error, change to igStalk2
  console.log(data)
  return data
}
instagramProfile("nechlophomeria")

// search movie from website Film Apik
async function searchFilm(query) {
  const data = await search.filmApikS(query)
  console.log(data)
  return data
}
searchFilm("the conjuring")

// get download link movie from url
async function filmapikDownloader(url) {
  const data = await search.filmApikDl(url)
  console.log(data)
  return data
}
filmapikDownloader("https://filmapik.ing/nonton-film-the-conjuring-the-devil-made-me-do-it-2021-subtitle-indonesia/play")

// search anime from otakudesu
async function otakudesu(query) {
  const data = await search.otakuDesuSearch(query)
  console.log(data)
  return data
}
otakudesu("kimetsu no yaiba")
