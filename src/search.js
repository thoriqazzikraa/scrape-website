const axios = require("axios")
const { baseFilmApik, baseOtakudesu, baseIgram } = require("../config/config.js")
const cheerio = require("cheerio")
const { convertMs } = require("../function/number.js")

async function tiktokStalk(user) {
  try {
    const { data } = await axios.get(`https://tiktok.com/@${user}`, {
      headers: {
        "User-Agent": "PostmanRuntime/7.32.2"
      }
    })
    const $ = cheerio.load(data)
    const dats = $("#__UNIVERSAL_DATA_FOR_REHYDRATION__").text()
    const result = JSON.parse(dats)
    if (result["__DEFAULT_SCOPE__"]["webapp.user-detail"].statusCode !== 0) {
      const ress = {
        status: "error",
        message: "User not found!"
      }
      console.log(ress)
      return ress
    }
    const res = result["__DEFAULT_SCOPE__"]["webapp.user-detail"]["userInfo"]
    return res
  } catch (err) {
    console.log(err)
    return String(err)
  }
}

async function tvList() {
  try {
    const { data } = await axios.get("https://www.jadwaltv.net/")
    let $ = cheerio.load(data)
    result = []
    $("nav#jadwaltv > ul > li").each(function () {
      let tv = $(this).find("a > span").text().replace(" ", "")
      result.push(tv)
    })
    return result.join(", ").split("SedangTayang")[0]
  } catch (err) {
    console.log(err)
    return String(err)
  }
}

async function jadwalTv(tv) {
  let result = { status: null, message: "", result: [] }
  try {
    const channel = tv.replace(" ", "").toLowerCase()
    const { data } = await axios.get("https://jadwaltv.net/channel/" + channel)
    let $ = cheerio.load(data)
    $("table.table > tbody > tr.jklIv").each(function () {
      result.status = true
      result.message = "ok"
      result.result.push({
        jam: $(this).find("td:nth-child(1)").text().replace("WIB", " WIB"),
        program: $(this).find("td:nth-child(2)").text()
      })
    })
    return result
  } catch (err) {
    result.status = false
    result.message = "List program for that tv not found"
    console.log(result)
    return result
  }
}

async function otakuDesuSearch(query) {
  const { data } = await axios.get(`${baseOtakudesu}?s=${query}&post_type=anime`)
  let i = 0
  let result = { status: true, data: [] }
  const $ = cheerio.load(data)
  $(".page > ul > li").each(function () {
    result.data.push({
      title: $(this).find("h2 > a").text().split(" Subtitle")[0],
      status: $(this).find("div:nth-child(4)").text().split(" : ")[1],
      genre: $(this).find("div:nth-child(3)").text().split(" : ")[1],
      rating: $(this).find("div:nth-child(5)").text().split(" : ")[1],
      thumbnail: $(this).find("img").attr("src"),
      url: $(this).find("h2 > a").attr("href")
    })
  })
  if (result.data.length === 0) {
    const result = {
      status: false,
      message: "Couldn't find the anime you looking for"
    }
    console.log(result)
    return result
  }
  return result
}

async function filmApikS(query) {
  // Search function
  const { data } = await axios.get(`${baseFilmApik}?s=${query}`)
  const $ = cheerio.load(data)
  let result = { status: true, data: [] }
  $(".search-page > .result-item > article").each(function () {
    result.data.push({
      title: $(this).find(".details > .title > a").text().replace("Nonton Film ", "").split(" Subtitle")[0].split(" Sub")[0],
      rating: $(this).find(".details > .meta > span").text().replace("IMDb ", "").replace("TMDb ", ""),
      thumbnail: $(this).find(".image > div > a > img").attr("src"),
      url: $(this).find(".image > div > a").attr("href"),
      synopsis: $(this).find(".details > .contenido > p").text().split("ALUR CERITA : – ")[1]
    })
  })
  if (result.data.length === 0) {
    const result = {
      status: false,
      message: "Couldn't find the movie you looking for"
    }
    console.log(result)
    return result
  }
  return result
}

async function filmApikDl(url) {
  // Get Movie Url Download
  const { data } = await axios.get(`${url}/play`)
  let result = {
    status: true,
    creator: "Thoriq Azzikra",
    Url: {}
  }
  const $ = cheerio.load(data)
  $(".box_links #download > .links_table > .fix-table > center > a").each(function () {
    let provider = $(this).text().split(" ")[1]
    let url = $(this).attr("href")
    result.Url[provider] = url
  })
  if (Object.keys(result.Url).length === 0) {
    const result = {
      status: false,
      message: "Couldn't find the download link"
    }
    console.log(result)
    return result
  }
  return result
}

async function similarSongs(songs) {
  let result = {}
  const getFirstSong = async () => {
    const { data } = await axios.get(`https://www.chosic.com/api/tools/search?q=${songs}&type=track&limit=1`, {
      headers: {
        Referer: "https://www.chosic.com"
      }
    })
    return data
  }
  const getData = await getFirstSong(songs)
  if (getData.tracks.items.length === 0) {
    result = {
      status: false,
      message: "No songs found!"
    }
    console.log(result)
    return result
  }
  const url = `https://www.chosic.com/api/tools/tracks/` + getData.tracks.items[0].id
  let { data } = await axios.get(url, {
    headers: {
      Referer: "https://www.chosic.com"
    }
  })
  try {
    const dataa = await axios.get(`https://www.chosic.com/api/tools/recommendations?seed_tracks=${getData.tracks.items[0].id}&limit=30`, {
      headers: {
        Referer: "https://www.chosic.com"
      }
    })
    const similarSongs = dataa.data.tracks.map((res) => {
      const resultt = {
        album: {
          type: res.album.album_type,
          name: res.album.name,
          releaseDate: res.album.release_date
        },
        title: res.name,
        duration: convertMs(res.duration_ms),
        artists: res.artists.map((art) => art.name).join(", "),
        popularity: res.popularity,
        thumbnail: res.album.image_large,
        previewUrl: res.preview_url
      }
      return resultt
    })
    result = {
      status: true,
      original: {
        album: {
          type: data.album.album_type,
          name: data.album.name,
          releaseDate: data.album.release_date
        },
        title: data.name,
        duration: convertMs(data.duration_ms),
        artists: data.artists.map((art) => art.name).join(", "),
        popularity: data.popularity,
        thumbnail: data.album.image_large,
        previewUrl: data.preview_url
      },
      similarSongs
    }
    return result
  } catch (err) {
    result = {
      status: false,
      statusCode: err.response.data.data.status,
      code: err.response.data.code,
      message: err.response.data.message
    }
    console.log(result)
    return result
  }
}

async function findSongs(text) {
  try {
    const expand = async () => {
      const { data } = await axios.get("https://songsear.ch/q/" + encodeURIComponent(text))
      let $ = cheerio.load(data)
      let result = {
        title: $("div.results > div:nth-child(1) > .head > h3 > b").text() + " - " + $("div.results > div:nth-child(1) > .head > h2 > a").text(),
        album: $("div.results > div:nth-child(1) > .head > p").text(),
        number: $("div.results > div:nth-child(1) > .head > a").attr("href").split("/")[4],
        thumb: $("div.results > div:nth-child(1) > .head > a > img").attr("src")
      }
      return result
    }
    const { title, album, thumb, number } = await expand(text)
    const { data } = await axios.get(`https://songsear.ch/api/song/${number}?text_only=true`)
    const lyric = data.song.text_html.replace(/<br\/>/g, "\n").replace(/&#x27;/g, "'")
    const result = {
      status: true,
      title: title,
      album: album,
      thumb: thumb,
      lyrics: lyric
    }
    return result
  } catch (err) {
    console.log(err)
    const result = {
      status: false,
      error: "Unknown error occurred"
    }
    return result
  }
}

async function lyrics2(query) {
  let result = {}
  try {
    const suggestSongs = async () => {
      const { data } = await axios.get(`https://search.azlyrics.com/suggest.php?q=${query}`)
      return data
    }
    const thisSongs = await suggestSongs(query)
    const datazlr = await fetch(thisSongs.songs[0].url).then((a) => a.text())
    const htmlText = datazlr
    const indexOfComment = htmlText.indexOf("Usage of azlyrics.com content by any third-party lyrics provider is prohibited by our licensing agreement. Sorry about that.")
    const startIndex = htmlText.lastIndexOf("<div", indexOfComment)
    const endIndex = htmlText.indexOf("</div>", indexOfComment) + 6
    const lyrics = htmlText
      .substring(startIndex, endIndex)
      .replace(/<!--[^>]*-->/g, "")
      .replace(/<br>/g, "")
      .replace(/<\/?div[^>]*>/g, "")
      .replace(/<\/?i[^>]*>/g, "")
      .trim()
    result.title = thisSongs.songs[0].autocomplete
    result.lyrics = lyrics
    return result
  } catch (err) {
    return String(err)
  }
}

async function lyrics(query) {
  let result = {}
  try {
    const lyricsFunc = async () => {
      const { data } = await axios.get(`https://api.genius.com/search?q=` + query, {
        headers: {
          Accept: "application/json",
          Host: "api.genius.com",
          "User-Agent": "PostmanRuntime/7.32.2",
          Authorization: "Bearer INJmdB4aW8JSDNQlkQmqlODP1KcRCH0-WdS6HfNtCnUPL3ReN-W5tUE9UFGJGsLP"
        }
      })
      return data.response.hits[0]
    }
    const dataLyrics = await lyricsFunc(query)
    result.status = true
    result.title = dataLyrics.result.title
    result.artists = dataLyrics.result.artist_names
    result.releaseDate = dataLyrics.result.release_date_for_display
    result.thumbnail = dataLyrics.result.header_image_url
    result.url = dataLyrics.result.url
    const { data } = await axios.get(result.url)
    let $ = cheerio.load(data)
    let lyrics = $('div[class="lyrics"]').text().trim()
    if (!lyrics) {
      lyrics = ""
      $('div[class^="Lyrics__Container"]').each((i, elem) => {
        if ($(elem).text().length !== 0) {
          let snippet = $(elem)
            .html()
            .replace(/<br>/g, "\n")
            .replace(/<(?!\s*br\s*\/?)[^>]+>/gi, "")
          lyrics += $("<textarea/>").html(snippet).text().trim() + "\n\n"
        }
      })
    }
    if (!lyrics) return null
    result.lyrics = lyrics.trim()
    return result
  } catch (err) {
    result.status = false
    result.message = "Lyrics not found!"
    console.log(result)
    return result
  }
}

async function igStalk(username) {
  try {
    const { data, status } = await axios.get(`${baseIgram}api/ig/userInfoByUsername/${username}`, {
      headers: {
        "User-Agent": "PostmanRuntime/7.37.0"
      }
    })
    if (data.result.user.pronouns.length === 0) {
      var pronoun = ""
    } else {
      const splPron = data.result.user.pronouns
      const addSlash = splPron.join("/")
      var pronoun = addSlash
    }
    const res = data.result.user
    const result = {
      status: true,
      creator: "Thoriq Azzikra",
      username: res.username,
      fullName: res.full_name,
      followers: res.follower_count,
      following: res.following_count,
      pronouns: pronoun,
      verified: res.is_verified,
      private: res.is_private,
      totalPosts: res.media_count,
      bio: res.biography,
      externalUrl: res.external_url,
      urlAcc: `https://instagram.com/${username}`,
      profilePic: res.hd_profile_pic_url_info.url,
      pkId: res.pk_id
    }
    return result
  } catch (err) {
    result = {
      status: false,
      creator: "Thoriq Azzikra",
      message: "Tidak dapat menemukan akun"
    }
    console.log(result)
    return result
  }
}

async function igStalk2(username) {
  try {
    const { data, status } = await axios.get(`https://snapinst.com/api/ig/userInfoByUsername/${username}`)
    if (data.result.user.pronouns.length === 0) {
      var pronoun = ""
    } else {
      const splPron = data.result.user.pronouns
      const addSlash = splPron.join("/")
      var pronoun = addSlash
    }
    const res = data.result.user
    const result = {
      status: true,
      creator: "Thoriq Azzikra",
      username: res.username,
      fullName: res.full_name,
      followers: res.follower_count,
      following: res.following_count,
      pronouns: pronoun,
      verified: res.is_verified,
      private: res.is_private,
      totalPosts: res.media_count,
      bio: res.biography,
      externalUrl: res.external_url,
      urlAcc: `https://instagram.com/${username}`,
      profilePic: res.hd_profile_pic_url_info.url,
      pkId: res.pk_id
    }
    return result
  } catch (err) {
    return (result = {
      status: false,
      creator: "Thoriq Azzikra",
      message: "Tidak dapat menemukan akun"
    })
    console.log(result)
  }
}

async function similarBand(query) {
  try {
    const { data } = await axios.get(`https://www.music-map.com/${query}`)
    let result = []
    const $ = cheerio.load(data)
    $("#gnodMap > a").each(function () {
      result.push($(this).text())
    })
    return result
  } catch {
    const result = {
      status: false,
      message: "Error, i can't find similar band that you looking for"
    }
    console.log(result)
    return result
  }
}

module.exports = {
  tiktokStalk,
  tvList,
  jadwalTv,
  similarSongs,
  findSongs,
  lyrics,
  lyrics2,
  similarBand,
  igStalk,
  igStalk2,
  filmApikS,
  filmApikDl,
  otakuDesuSearch
}
