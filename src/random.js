const axios = require("axios")
const cheerio = require("cheerio")
const baseCerpen = "http://cerpenmu.com/100-cerpen-kiriman-terbaru"
const { pickRandom } = require("../function/pickRandom.js")
const { isUrl } = require("../function/isUrl.js")

async function gore() {
  let result = { status: null, message: "", pages: null, result: [] }
  try {
    const page = Math.floor(Math.random() * 723)
    result.pages = page
    const { data } = await axios.get("https://kaotic.com/?page=" + page)
    const $ = cheerio.load(data)
    $(".row > div > div.tab-wrapper").each(function () {
      $(this)
        .find(".tab-content > .row > div.col-xs-6")
        .each(function () {
          result.status = true
          result.message = "ok"
          result.result.push({
            title: $(this).find(".video > h2").text(),
            author: $(this).find(".video > .info > span > a").text(),
            views: $(this).find(".video > .info > .views-count > span").text(),
            comments: $(this).find(".video > .info > .comm-count > span").text(),
            url: $(this).find(".video > .video-image > a").attr("href"),
            thumbnail: $(this).find(".video > .video-image > a > img").attr("src")
          })
        })
    })
    if (result.result.length === 0) {
      ;(result.status = false), (result.message = "Unknown error occurred"), (result.pages = null), (result.result = null)
      return result
    }
    return result
  } catch (err) {
    result.status = false
    result.message = String(err)
    result.pages = null
    result.result = null
    return result
  }
}

async function randomGore() {
  let result = {}
  try {
    const getGore = await gore()
    if (getGore.status === false) return getGore.message
    const randoms = pickRandom(getGore.result)
    const { data } = await axios.get(randoms.url)
    const $ = cheerio.load(data)
    result.status = true
    result.title = randoms.title
    result.author = randoms.author
    result.views = randoms.views
    result.comments = randoms.comments
    result.url = $("div.video-container > .video-content > .video-js > source").attr("src")
    return result
  } catch (err) {
    result.status = false
    result.message = String(err)
    return result
  }
}

async function hubbleImg() {
  let result = {}
  try {
    const randomNumber = Math.floor(Math.random() * 21)
    const { data } = await axios.get(`https://esahubble.org/images/viewall/page/${randomNumber}/`)
    let $ = cheerio.load(data)
    const scriptRes = $("script").html().split("=")[1]
    const repl = scriptRes.replace(/'/g, '"')
    const jsonResult = JSON.parse(JSON.stringify(repl, null, 2))
    const pushUrl = isUrl(jsonResult)
    const randomResult = Math.floor(Math.random() * pushUrl.length)
    const spl = pushUrl[randomResult].split("/")[6]
    const info = jsonResult
      .split(`id: "${spl.replace(".jpg", "")}",`)[1]
      .split("}")[0]
      .trim()
    const checkPtw = info.split("potw:")[1]
    const evalPtw = eval(checkPtw)
    const potw = evalPtw ? evalPtw : "Unknown"
    const urlPublic = pushUrl[randomResult].replace("thumb300y", "publicationjpg")
    const urlLarge = pushUrl[randomResult].replace("thumb300y", "large")
    let title = info.split(`title: "`)[1].split(`"`)[0].replace("&#39;", "'")
    const images = await fetch(urlPublic)
    if (images.status !== 200) {
      var img = urlLarge
      var quality = "Large"
    } else {
      var img = urlPublic
      var quality = "Publication JPG"
    }
    result.title = title
    result.releaseDate = potw
    result.quality = quality
    result.url = img
    return result
  } catch (err) {
    console.log(err)
    return String(err)
  }
}

async function randomTiktok2(username) {
  const options = {
    headers: {
      origin: "https://tokcounter.com",
      referer: "https://tokcounter.com/",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36"
    }
  }
  if (username.startsWith("@")) {
    var user = username.replace("@", "")
  } else {
    var user = username
  }
  try {
    const getId = await axios.get(`https://tiktok.livecounts.io/user/data/${user}`, options)
    const { data } = await axios.get(`https://tiktok.livecounts.io/user/videoList/${getId.data.userId}`, options)
    const randomId = pickRandom(data.userData)
    const dataa = await axios.get(`https://tiktok.livecounts.io/video/download/${randomId.id}`, options)
    const result = {
      status: true,
      caption: randomId.title,
      author: data.author,
      publishDate: randomId.publishedAt,
      thumbnail: randomId.dynamicCover,
      stats: randomId.statistics,
      audio: {
        title: dataa.data.sound.title,
        url: dataa.data.sound.downloadUrl
      },
      video: dataa.data.video.downloadUrl
    }
    return result
  } catch (err) {
    if (!err.response.data.success) {
      const result = {
        status: false,
        message: "Couldn't find the account"
      }
      console.log(result)
      return result
    } else {
      console.log(err)
      return String(err)
    }
  }
}

async function randomTiktok(username) {
  let result = {}
  if (!username.startsWith("@")) {
    var user = "@" + username
  } else {
    var user = username
  }
  const { data } = await axios.get(`https://tiktok-video-no-watermark2.p.rapidapi.com/user/posts?unique_id=${user}&count=1000`, {
    headers: {
      Accept: "application/json",
      "X-RapidAPI-Key": "61f99d3e77msh61688cbb09796b4p18b365jsn09c26ce3e5c4",
      "X-RapidAPI-Host": "tiktok-video-no-watermark2.p.rapidapi.com",
      "User-Agent": "PostmanRuntime/7.32.2",
      Referer: "https://tik.storyclone.com/"
    }
  })
  if (data.code != 0) {
    result.status = false
    result.message = "Tidak dapat menemukan akun"
    console.log(result)
    return result
  }
  result.status = true
  result.data = pickRandom(data.data.videos)
  console.log(result.status)
  return result
}

const listCerpen = async () => {
  const { data } = await axios.get(baseCerpen)
  let result = []
  const $ = cheerio.load(data)
  $("#content > article > strong > a").each(function () {
    result.push($(this).attr("href"))
  })
  const rndm = pickRandom(result)
  return rndm
}

async function getCerpenHorror() {
  try {
    const getUrl = async () => {
      const randomNumber = Math.floor(Math.random() * 127)
      const { data } = await axios.get(`https://cerpenmu.com/category/cerpen-horor-hantu/page/${randomNumber}`)
      const $ = cheerio.load(data)
      let result = []
      $("div#wrap > #content > article > article").each(function () {
        result.push($(this).find("h2 > a").attr("href"))
      })
      return pickRandom(result)
    }
    const url = await getUrl()
    const { data } = await axios.get(url)
    let $ = cheerio.load(data)
    const result = {
      status: true,
      title: $("#content > article > h1").text(),
      creator: $("#content > article > a:nth-child(2)").text(),
      category: $("#content > article > a:nth-child(4)").text(),
      story: $("#content > article > p").text().split("Cerpen Karangan")[0]
    }
    return result
  } catch (err) {
    const result = {
      status: false,
      message: String(err)
    }
  }
}
async function getCerpen() {
  try {
    const getUrlCerpen = await listCerpen()
    const { data } = await axios.get(getUrlCerpen)
    const $ = cheerio.load(data)
    const result = {
      status: true,
      title: $("#content > article > h1").text(),
      creator: $("#content > article > a:nth-child(2)").text(),
      category: $("#content > article > a:nth-child(4)").text(),
      cerpen: $("#content > article > p").text()
    }
    return result
  } catch {
    const result = {
      status: false,
      message: "Unknown error occurred"
    }
    console.log(result)
    return result
  }
}

async function truthOrDare(language) {
  const lang = language ? language : "id"
  try {
    const dareFunc = async () => {
      const { data } = await axios(`https://psycatgames.com/api/tod-v2/`, {
        method: "post",
        data: {
          id: "truth-or-dare",
          language: lang,
          category: "mixed",
          type: "dare"
        },
        headers: {
          Referer: "https://psycatgames.com"
        }
      })
      const randomResult = pickRandom(data.results)
      return randomResult
    }
    const dare = await dareFunc(lang)
    const { data } = await axios(`https://psycatgames.com/api/tod-v2/`, {
      method: "post",
      data: {
        id: "truth-or-dare",
        language: lang,
        category: "mixed",
        type: "truth"
      },
      headers: {
        Referer: "https://psycatgames.com"
      }
    })
    const randomResult = pickRandom(data.results)
    const result = {
      status: true,
      dare: dare,
      truth: randomResult
    }
    return result
  } catch (err) {
    console.log(err)
    const res = { status: false, message: "Unknown error occurred." }
    return res
  }
}

async function neko() {
  try {
    const { data } = await axios.get("https://api.waifu.pics/sfw/neko")
    return data
  } catch (err) {
    console.log(err)
    return String(err)
  }
}

async function waifu() {
  try {
    const { data } = await axios.get("https://api.waifu.pics/sfw/waifu")
    return data
  } catch (err) {
    console.log(err)
    return String(err)
  }
}

async function shinobu() {
  try {
    const { data } = await axios.get("https://api.waifu.pics/sfw/shinobu")
    return data
  } catch (err) {
    console.log(err)
    return String(err)
  }
}

module.exports = {
  anime: {
    neko,
    waifu,
    shinobu
  },
  gore,
  randomGore,
  hubbleImg,
  truthOrDare,
  getCerpen,
  getCerpenHorror,
  randomTiktok,
  randomTiktok2
}
