const axios = require("axios")
const cheerio = require("cheerio")
const baseCerpen = "http://cerpenmu.com/100-cerpen-kiriman-terbaru"
const { pickRandom } = require("../function/pickRandom.js")

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
      "X-RapidAPI-Key": "533115be6amsh2515f73f171c6f1p160d9djsn833294e42f10",
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
  truthOrDare,
  getCerpen,
  getCerpenHorror,
  randomTiktok
}
