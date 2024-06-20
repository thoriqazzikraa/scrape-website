const axios = require("axios")
const fetch = require("node-fetch")
const formData = require("form-data")
const { isUrl } = require("../function/isUrl.js")
const cheerio = require("cheerio")
const { igStalk, igStalk2 } = require("./search.js")

async function twitterdl2(url) {
  try {
    const result = { status: true, type: "", media: [] }
    const { data } = await axios(`https://savetwitter.net/api/ajaxSearch`, {
      method: "post",
      data: { q: url, lang: "en" },
      headers: {
        accept: "*/*",
        "user-agent": "PostmanRuntime/7.32.2",
        "content-type": "application/x-www-form-urlencoded"
      }
    })
    let $ = cheerio.load(data.data)
    if ($("div.tw-video").length === 0) {
      $("div.video-data > div > ul > li").each(function () {
        result.type = "image"
        result.media.push($(this).find("div > div:nth-child(2) > a").attr("href"))
      })
    } else {
      $("div.tw-video").each(function () {
        if ($(this).find(".tw-right > div > p:nth-child(1) > a").text().includes("(")) {
          var qualityText = $(this).find(".tw-right > div > p:nth-child(1) > a").text().split("(")[1].split("p")[0].trim()
        } else {
          var qualityText = $(this).find(".tw-right > div > p:nth-child(1) > a").text().trim()
        }
        result.type = "video"
        result.media.push({
          quality: qualityText,
          url: $(this).find(".tw-right > div > p:nth-child(1) > a").attr("href")
        })
      })
    }
    return result
  } catch (err) {
    const result = {
      status: false,
      message: "Media not found!\n\n" + String(err)
    }
    console.log(result)
    return result
  }
}

async function threads(url) {
  try {
    const { data } = await axios.get(`https://api.threadsphotodownloader.com/v2/media?url=${url}`)
    return data
  } catch (err) {
    return String(err)
  }
}

async function fbdl(url) {
  try {
    let result = {}
    const { data } = await axios(`https://getmyfb.com/process`, {
      method: "post",
      data: { id: url, locale: "en" },
      headers: {
        "HX-Request": true,
        "HX-Trigger": "form",
        "HX-Target": "target",
        "HX-Current-URL": "https://getmyfb.com/en",
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
    const $ = cheerio.load(data)
    const thumbnail = $("section > div:nth-child(2) > .results-item > div > img").attr("src")
    const high = $("section > div:nth-child(2) > .results-download > ul > li:nth-child(1) > a").attr("href")
    const low = $("section > div:nth-child(2) > .results-download > ul > li:nth-child(2) > a").attr("href")
    if (!thumbnail && !high && !low) {
      result.status = false
      result.message = "Couldn't fetch data of url"
      return result
    }
    result.status = true
    result.thumbnail = thumbnail
    result.high = high
    result.low = low
    return result
  } catch (err) {
    const result = {
      status: false,
      message: String(err)
    }
    console.log(result)
    return result
  }
}

async function twitterdl(url) {
  const { data } = await axios.get(`https://twitsave.com/info?url=${url}`)
  let $ = cheerio.load(data)
  let result = []
  $("div.origin-top-right > ul > li").each(function () {
    result.push({
      width: $(this).find("a > div > div > div").text().split("Resolution: ")[1].split("x")[0],
      height: $(this).find("a > div > div > div").text().split("Resolution: ")[1].split("x")[1],
      url: $(this).find("a").attr("href")
    })
  })
  if (result.length === 0 || result.length === null) {
    const result = {
      status: false,
      message: "Tidak dapat menemukan video"
    }
    console.log(result)
    return result
  }
  resolt = result.sort(function (a, b) {
    return a.height - b.height
  })
  arrayResult = resolt[resolt.length - 1]
  return resolt.filter((video) => video.width === arrayResult.width)
}

async function tiktokdl(url) {
  let result = {}
  try {
    const { data } = await axios("https://tikdownloader.io/api/ajaxSearch", {
      method: "post",
      data: { q: url, lang: "id" },
      headers: {
        Accept: "*/*",
        "Content-Type": "application/x-www-form-urlencoded",
        "X-Requested-With": "XMLHttpRequest"
      }
    })
    let $ = cheerio.load(data.data)
    if ($("div.video-data > .photo-list").length === 0) {
      result.status = true
      result.type = "video"
      result.caption = $("div.video-data > div > .tik-left > .thumbnail > .content > .clearfix > h3").text()
      result.thumbnail = $("div.video-data > div > div:nth-child(1) > div > div:nth-child(1) > img").attr("src")
      result.video = {}
      result.video.server1 = $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href")
      result.video.server2 = $("div.video-data > div > .tik-right > div > p:nth-child(2) > a").attr("href")
      result.video.serverHD = $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").attr("href")
      result.audio = {}
      result.audio.url = $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href")
    } else {
      result.status = true
      result.type = "image"
      result.caption = $("div.video-data > div > .tik-left > .thumbnail > .content > .clearfix > h3").text()
      result.thumbnail = $("div.video-data > div > div:nth-child(1) > div > div:nth-child(1) > img").attr("src")
      result.audio = {}
      result.audio.url = $("div.video-data > div > .tik-right > div > p:nth-child(2) > a").attr("href")
      result.images = []
      $("div.video-data > .photo-list > ul > li").each(function () {
        result.images.push($(this).find("div > div:nth-child(2) > a").attr("href"))
      })
    }
    return result
  } catch (err) {
    result.status = false
    result.message = "Video not found!"
    result.messageCmd = String(err)
    console.log(result)
    return result
  }
}

async function igdl2(url) {
  try {
    let result = { status: true, media: [] }
    const { data } = await axios(`https://fastdl.app/c/`, {
      method: "post",
      data: { url: url, lang_code: "id", token: "" },
      headers: {
        "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
        "user-agent": "PostmanRuntime/7.32.2"
      }
    })
    const $ = cheerio.load(data)
    $("div > div > div:nth-child(2)").each(function () {
      result.media.push($(this).find("a").attr("href"))
    })
    if (result.media.length === 0) {
      const resz = {
        status: false,
        message: "Unknown error occurred"
      }
      console.log(resz)
      return resz
    }
    console.log(result)
    return result
  } catch (err) {
    const result = {
      status: false,
      message: `Media not found`
    }
    return result
  }
}

async function igdl(url) {
  try {
    const resp = await axios.post("https://saveig.app/api/ajaxSearch", new URLSearchParams({ q: url, t: "media", lang: "id" }), {
      headers: {
        accept: "*/*",
        "user-agent": "PostmanRuntime/7.32.2"
      }
    })
    let result = { status: true, data: [] }
    const $ = cheerio.load(resp.data.data)
    $(".download-box > li > .download-items").each(function () {
      result.data.push($(this).find(".download-items__btn > a").attr("href"))
    })
    return result
  } catch {
    const result = {
      status: false,
      message: "Couldn't fetch data of url"
    }
    console.log(result)
    return result
  }
}

async function pindl(url) {
  try {
    const { data } = await axios.get(`https://www.savepin.app/download.php?url=${url}&lang=en&type=redirect`)
    const $ = cheerio.load(data)
    const sources = $(".download-link > div:nth-child(5) > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(3) > a").attr("href")
    if (sources.includes("force-save.php")) {
      var urll = decodeURIComponent(sources.split("url=")[1])
    } else {
      var urll = $(".download-link > div:nth-child(5) > div:nth-child(1) > table > tbody > tr:nth-child(1) > td:nth-child(3) > a").attr("href")
    }
    const result = {
      status: true,
      url: urll
    }
    return result
  } catch (err) {
    result = {
      status: false,
      msg: "Error: Invalid URL!"
    }
    console.log(err)
    return result
  }
}
async function tiktokdl2(url) {
  let result = {}
  const bodyForm = new formData()
  bodyForm.append("q", url)
  bodyForm.append("lang", "id")
  try {
    const { data } = await axios(`https://savetik.co/api/ajaxSearch`, {
      method: "post",
      data: bodyForm,
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "User-Agent": "PostmanRuntime/7.32.2"
      }
    })
    let $ = cheerio.load(data.data)
    if ($("div.video-data > .photo-list").length === 0) {
      result.status = true
      result.type = "video"
      result.caption = $("div.video-data > div > .tik-left > .thumbnail > .content > .clearfix > h3").text()
      result.thumbnail = $("div.video-data > div > div:nth-child(1) > div > div:nth-child(1) > img").attr("src")
      result.video = {}
      result.video.server1 = $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href")
      result.video.server2 = $("div.video-data > div > .tik-right > div > p:nth-child(2) > a").attr("href")
      result.video.serverHD = $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").attr("href")
      result.audio = {}
      result.audio.url = $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href")
    } else {
      result.status = true
      result.type = "image"
      result.caption = $("div.video-data > div > .tik-left > .thumbnail > .content > .clearfix > h3").text()
      result.thumbnail = $("div.video-data > div > div:nth-child(1) > div > div:nth-child(1) > img").attr("src")
      result.audio = {}
      result.audio.url = $("div.video-data > div > .tik-right > div > p:nth-child(2) > a").attr("href")
      result.images = []
      $("div.video-data > .photo-list > ul > li").each(function () {
        result.images.push($(this).find("div > div:nth-child(2) > a").attr("href"))
      })
    }
    return result
  } catch (err) {
    result.status = false
    result.message = "Video not found!"
    console.log(result)
    return result
  }
}

async function soundcloud(url) {
  if (!isUrl(url)) throw new Error("Please input url")
  if (!url.includes("soundcloud.com")) throw new Error("Invalid soundcloud url")
  try {
    const { data } = await axios(`https://api.downloadsound.cloud/track`, {
      method: "post",
      data: { url: url },
      headers: {
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (err) {
    console.log(err.response.data)
    return err.response.data
  }
}

async function spotify(url) {
  if (!isUrl(url)) throw new Error("Please input Url")
  if (url.includes("spotify.link")) {
    const getOriginalUrl = async () => {
      const data = await fetch(url)
      return data.url
    }
    const originalUrl = await getOriginalUrl(url)
    const track = await axios.get(`https://api.spotifydown.com/metadata/track/${originalUrl.split("track/")[1].split("?")[0]}`, {
      headers: {
        Origin: "https://spotifydown.com",
        Referer: "https://spotifydown.com/"
      }
    })
    const { data } = await axios.get(`https://api.spotifydown.com/download/${track.data.id}`, {
      headers: {
        Origin: "https://spotifydown.com",
        Referer: "https://spotifydown.com/"
      }
    })
    return data
  } else if (url.includes("open.spotify.com")) {
    const { data } = await axios.get(`https://api.spotifydown.com/download/${url.split("track/")[1].split("?")[0]}`, {
      headers: {
        Origin: "https://spotifydown.com",
        Referer: "https://spotifydown.com/"
      }
    })
    return data
  } else {
    const result = {
      status: false,
      message: "Please input valid spotify url"
    }
    console.log(result)
    return result
  }
}

async function igStory(username) {
  try {
    const { data } = await axios.get(`https://igram.world/api/ig/story?url=https://instagram.com/stories/${username}`, {
      headers: {
        "User-Agent": "PostmanRuntime/7.37.0"
      }
    })
    let result = { status: true, media: [] }
    data.result.map((check) => {
      if (check.has_audio === true) {
        var url = check.video_versions[0].url
      } else {
        var res = check.image_versions2.candidates.find((media) => media.height <= 3000)
        var url = res.url
      }
      result.media.push(url)
    })
    if (result.media.length === 0) {
      result.status = false
      result.media = null
      result.message = `The account you're looking for doesn't have any stories or maybe the account is private.`
    }
    return result
  } catch (err) {
    console.log(err)
    const result = {
      status: false,
      message: "Unknown error occurred."
    }
    return result
  }
}

async function igStory2(username) {
  try {
    const { pkId } = await igStalk2(username)
    const { data } = await axios.get(`https://snapinst.com/api/ig/stories/${pkId}`)
    let result = { status: true, media: [] }
    data.result.map((check) => {
      if (check.has_audio === true) {
        var url = check.video_versions[0].url
      } else {
        var res = check.image_versions2.candidates.find((media) => media.height <= 3000)
        var url = res.url
      }
      result.media.push(url)
    })
    if (result.media.length === 0) {
      result.status = false
      result.media = null
      result.message = `The account you're looking for doesn't have any stories or maybe the account is private.`
    }
    return result
  } catch (err) {
    console.log(err)
    const result = {
      status: false,
      message: "Unknown error occurred."
    }
    return result
  }
}

module.exports = {
  tiktokdl2,
  soundcloud,
  spotify,
  igStory,
  igStory2,
  twitterdl2,
  igdl2,
  threads,
  fbdl,
  twitterdl,
  tiktokdl,
  pindl,
  igdl
}
