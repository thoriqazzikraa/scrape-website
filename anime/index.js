const axios = require("axios");

async function neko() {
  try {
    const { data } = await axios.get("https://api.waifu.pics/sfw/neko");
    return data;
  } catch (err) {
    console.log(err);
    return String(err);
  }
}

async function waifu() {
  try {
    const { data } = await axios.get("https://api.waifu.pics/sfw/waifu");
    return data;
  } catch (err) {
    console.log(err);
    return String(err);
  }
}

async function shinobu() {
  try {
    const { data } = await axios.get("https://api.waifu.pics/sfw/shinobu");
    return data;
  } catch (err) {
    console.log(err);
    return String(err);
  }
}

module.exports = { neko, waifu, shinobu };
