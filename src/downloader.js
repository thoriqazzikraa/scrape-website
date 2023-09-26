const axios = require("axios")
const fetch = require("node-fetch")
const formData = require("form-data")
const { isUrl } = require("../function/isUrl.js")

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
        result.type = "video"
        result.media.push({
          quality: $(this).find(".tw-right > div > p:nth-child(1) > a").text().split("(")[1].split(")")[0],
          url: $(this).find(".tw-right > div > p:nth-child(1) > a").attr("href")
        })
      })
    }
    return result
  } catch (err) {
    const result = {
      status: false,
      message: "Media not found!" + String(err)
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
    const { data } = await axios(`https://fdownload.app/api/ajaxSearch`, {
      method: "post",
      data: { p: "home", q: url, lang: "en" },
      headers: {
        accept: "*/*",
        "content-type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest"
      }
    })
    const $ = cheerio.load(data.data)
    let result = []
    $("#fbdownloader > div.tab-wrap > div:nth-child(5) > table > tbody > tr").each(function () {
      if ($(this).find("td:nth-child(2)").text() === "Yes") {
        var link = $(this).find("td:nth-child(3) > button").attr("data-videourl")
      } else {
        var link = $(this).find("td:nth-child(3) > a").attr("href")
      }
      result.push({
        quality: $(this).find("td.video-quality").text().split("p")[0],
        render: $(this).find("td:nth-child(2)").text(),
        url: link
      })
    })
    if (result.length === 0) {
      const result = {
        status: false,
        message: "Couldn't fetch data of url"
      }
      return result
    }
    return result.filter((filter) => filter.render === "No")
  } catch (err) {
    const result = {
      status: false,
      message: `Couldn't fetch data of url\n\n${String(err)}`
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
  try {
    const { data } = await axios(`https://downloader.bot/api/tiktok/info`, {
      method: "post",
      data: { url: url },
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      }
    })
    return data
  } catch (err) {
    const result = {
      status: false,
      message: "Video not found",
      messageCmd: String(err)
    }
    console.log(result)
    return result
  }
}

async function igdl2(url) {
  try {
    let result = { status: true, media: [] }
    const { data } = await axios(`https://www.y2mate.com/mates/analyzeV2/ajax`, {
      method: "post",
      data: {
        k_query: url,
        k_page: "Instagram",
        hl: "id",
        q_auto: 0
      },
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "user-agent": "PostmanRuntime/7.32.2"
      }
    })
    await data.links.video.map((video) => result.media.push(video.url))
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
    const result = {
      status: true,
      url: decodeURIComponent($(".download-link > div:nth-child(2) > div > table > tbody >  tr:nth-child(1) > td:nth-child(3) > a").attr("href").split("url=")[1])
    }
    console.log(result)
    return result
  } catch (err) {
    result = {
      status: false,
      msg: "Error: Invalid URL!"
    }
    console.log(result)
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
    const $ = cheerio.load(data.data)
    result.status = true
    result.caption = $("div.video-data > div > .tik-left > div > .content > div > h3").text()
    ;(result.server1 = {
      quality: "MEDIUM",
      url: $("div.video-data > div > .tik-right > div > p:nth-child(1) > a").attr("href")
    }),
      (result.server2 = {
        quality: "MEDIUM",
        url: $("div.video-data > div > .tik-right > div > p:nth-child(2) > a").attr("href")
      }),
      (result.serverHD = {
        quality: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").text().split("MP4 ")[1],
        url: $("div.video-data > div > .tik-right > div > p:nth-child(3) > a").attr("href")
      }),
      (result.audio = $("div.video-data > div > .tik-right > div > p:nth-child(4) > a").attr("href"))
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
    const { pkId } = await igStalk(username)
    const { data } = await axios.get(`https://instasupersave.com/api/ig/stories/${pkId}`)
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
  twitterdl2,
  igdl2,
  threads,
  fbdl,
  twitterdl,
  tiktokdl,
  pindl,
  igdl
}
