const axios = require("axios")

async function textToImage(text) {
  try {
    const { data } = await axios.get("https://tti.photoleapapp.com/api/v1/generate?prompt=" + text)
    const result = {
      status: true,
      url: data.result_url
    }
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

module.exports = { textToImage }
