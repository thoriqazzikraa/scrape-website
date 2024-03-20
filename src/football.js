const axios = require("axios")
const cheerio = require("cheerio")

async function standings(league) {
  let result = []
  let liga = league.toLowerCase()
  const perancis = liga === "france" || liga === "prancis" || liga === "perancis" || liga === "ligue 1"
  const jerman = liga === "german" || liga === "germany" || liga === "bundes liga" || liga === "bundesliga" || liga === "jerman"
  const ind = liga === "indonesia" || liga === "indo" || liga === "ind"
  const eng = liga === "inggris" || liga === "premier league" || liga === "english" || liga === "premier" || liga === "england"
  const italy = liga === "italia" || liga === "italy" || liga === "serie a"
  const spanyol = liga === "spain" || liga === "spanyol" || liga === "la liga" || liga === "laliga"
  const ucl = liga === "ucl" || liga === "champion" || liga === "champions"
  try {
    if (ucl) {
      const { data } = await axios.get("https://www.bola.net/klasemen/champions.html")
      let $ = cheerio.load(data)
      $("div.box-group > div").each(function () {
        const group = $(this).find("h3").text()
        result[group] = []
        $(this)
          .find("div > table > tbody > tr")
          .each(function () {
            result[group].push({
              rank: $(this).find("th > div > span:nth-child(1)").text(),
              name: $(this).find("th > div > span:nth-child(2) a > span:nth-child(2)").text(),
              match: $(this).find("td:nth-child(2)").text(),
              point: $(this).find("td:nth-child(3)").text(),
              win: $(this).find("td:nth-child(4)").text(),
              draw: $(this).find("td:nth-child(5)").text(),
              lose: $(this).find("td:nth-child(6)").text(),
              goals: $(this).find("td:nth-child(7)").text(),
              gd: $(this).find("td:nth-child(8)").text()
            })
          })
      })
      return result
    }
    if (eng) {
      const { data } = await axios.get("https://www.bola.net/klasemen/inggris.html")
      let $ = cheerio.load(data)
      $("table.main-table > tbody > tr").each(function () {
        result.push({
          name: $(this).find("th > div > span:nth-child(2) > a > span:nth-child(2)").text(),
          rank: $(this).find("th > div > span:nth-child(1)").text(),
          match: $(this).find("td:nth-child(2)").text(),
          point: $(this).find("td:nth-child(3)").text(),
          win: $(this).find("td:nth-child(4)").text(),
          draw: $(this).find("td:nth-child(5)").text(),
          lose: $(this).find("td:nth-child(6)").text(),
          goals: $(this).find("td:nth-child(7)").text(),
          gd: $(this).find("td:nth-child(8)").text()
        })
      })
      return result
    }
    if (jerman) {
      const { data } = await axios.get("https://www.bola.net/klasemen/jerman.html")
      let $ = cheerio.load(data)
      $("table.main-table > tbody > tr").each(function () {
        result.push({
          name: $(this).find("th > div > span:nth-child(2) > a > span:nth-child(2)").text(),
          rank: $(this).find("th > div > span:nth-child(1)").text(),
          match: $(this).find("td:nth-child(2)").text(),
          point: $(this).find("td:nth-child(3)").text(),
          win: $(this).find("td:nth-child(4)").text(),
          draw: $(this).find("td:nth-child(5)").text(),
          lose: $(this).find("td:nth-child(6)").text(),
          goals: $(this).find("td:nth-child(7)").text(),
          gd: $(this).find("td:nth-child(8)").text()
        })
      })
      return result
    }
    if (perancis) {
      const { data } = await axios.get("https://www.bola.net/klasemen/prancis.html")
      let $ = cheerio.load(data)
      $("table.main-table > tbody > tr").each(function () {
        result.push({
          name: $(this).find("th > div > span:nth-child(2) > a > span:nth-child(2)").text(),
          rank: $(this).find("th > div > span:nth-child(1)").text(),
          match: $(this).find("td:nth-child(2)").text(),
          point: $(this).find("td:nth-child(3)").text(),
          win: $(this).find("td:nth-child(4)").text(),
          draw: $(this).find("td:nth-child(5)").text(),
          lose: $(this).find("td:nth-child(6)").text(),
          goals: $(this).find("td:nth-child(7)").text(),
          gd: $(this).find("td:nth-child(8)").text()
        })
      })
      return result
    }
    if (ind) {
      const { data } = await axios.get("https://www.bola.net/klasemen/indonesia.html")
      let $ = cheerio.load(data)
      $("table.main-table > tbody > tr").each(function () {
        result.push({
          name: $(this).find("th > div > span:nth-child(2) > a > span:nth-child(2)").text(),
          rank: $(this).find("th > div > span:nth-child(1)").text(),
          match: $(this).find("td:nth-child(2)").text(),
          point: $(this).find("td:nth-child(3)").text(),
          win: $(this).find("td:nth-child(4)").text(),
          draw: $(this).find("td:nth-child(5)").text(),
          lose: $(this).find("td:nth-child(6)").text(),
          goals: $(this).find("td:nth-child(7)").text(),
          gd: $(this).find("td:nth-child(8)").text()
        })
      })
      return result
    }
    if (spanyol) {
      const { data } = await axios.get("https://www.bola.net/klasemen/spanyol.html")
      let $ = cheerio.load(data)
      $("table.main-table > tbody > tr").each(function () {
        result.push({
          name: $(this).find("th > div > span:nth-child(2) > a > span:nth-child(2)").text(),
          rank: $(this).find("th > div > span:nth-child(1)").text(),
          match: $(this).find("td:nth-child(2)").text(),
          point: $(this).find("td:nth-child(3)").text(),
          win: $(this).find("td:nth-child(4)").text(),
          draw: $(this).find("td:nth-child(5)").text(),
          lose: $(this).find("td:nth-child(6)").text(),
          goals: $(this).find("td:nth-child(7)").text(),
          gd: $(this).find("td:nth-child(8)").text()
        })
      })
      return result
    }
    if (italy) {
      const { data } = await axios.get("https://www.bola.net/klasemen/italia.html")
      let $ = cheerio.load(data)
      $("table.main-table > tbody > tr").each(function () {
        result.push({
          name: $(this).find("th > div > span:nth-child(2) > a > span:nth-child(2)").text(),
          rank: $(this).find("th > div > span:nth-child(1)").text(),
          match: $(this).find("td:nth-child(2)").text(),
          point: $(this).find("td:nth-child(3)").text(),
          win: $(this).find("td:nth-child(4)").text(),
          draw: $(this).find("td:nth-child(5)").text(),
          lose: $(this).find("td:nth-child(6)").text(),
          goals: $(this).find("td:nth-child(7)").text(),
          gd: $(this).find("td:nth-child(8)").text()
        })
      })
      return result
    }
  } catch (err) {
    console.log(err)
    return String(err)
  }
}

module.exports = { standings }
