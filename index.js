const axios = require("axios");
const cheerio = require("cheerio");
const indoDrama = "https://id.indodrama.net/";
const base21 = "https://terbit21.art/";
const baseFilmApik = "https://filmapik21.live/";
const baseOtakudesu = "https://otakudesu.lol/";
const baseCerpen = "http://cerpenmu.com/100-cerpen-kiriman-terbaru";
const baseSSS = "https://instasupersave.com/";
const formData = require("form-data");
const bodyForm = new formData();

const { num } = require("../function");

const pickRandom = async (ext) => {
  return ext[Math.floor(Math.random() * ext.length)];
};

async function cekResi(kurir, resi) {
  let { data } = await axios(`https://pluginongkoskirim.com/front/resi`, {
    method: "post",
    data: { kurir: kurir, resi: resi },
    headers: {
      accept: "*/*",
      "content-type": "application/json",
    },
  });
  return data;
}

async function tiktokdl(url) {
  try {
    const { data } = await axios(`https://downloader.bot/api/tiktok/info`, {
      method: "post",
      data: { url: url },
      headers: {
        accept: "*/*",
        "content-type": "application/json",
      },
    });
    return data;
  } catch {
    const result = {
      status: false,
      message: "Couldn't fetch data of url",
    };
    console.log(result);
    return result;
  }
}

async function igdl(url) {
  try {
    const resp = await axios.post(
      "https://saveig.app/api/ajaxSearch",
      new URLSearchParams({ q: url, t: "media", lang: "id" }),
      {
        headers: {
          accept: "*/*",
          "user-agent": "PostmanRuntime/7.32.2",
        },
      }
    );
    let result = { status: true, data: [] };
    const $ = cheerio.load(resp.data.data);
    $(".download-box > li > .download-items").each(function () {
      $(this)
        .find(".photo-option > select > option")
        .each(function () {
          let resolution = $(this).text();
          let url = $(this).attr("value");
          if (/1080/gi.test(resolution)) result.data.push(url);
        });
      $(this)
        .find("div:nth-child(2)")
        .each(function () {
          let url2 = $(this).find("a").attr("href");
          if (!url2) return;
          if (!/\.webp/gi.test(url2)) {
            result.data.push(url2);
          }
        });
    });
    return result;
  } catch {
    const result = {
      status: false,
      message: "Couldn't fetch data of url",
    };
    console.log(result);
    return result;
  }
}

async function pindl(url) {
  try {
    const { data } = await axios.get(
      `https://www.savepin.app/download.php?url=${url}&lang=en&type=redirect`
    );
    const $ = cheerio.load(data);
    const result = {
      status: true,
      url: decodeURIComponent(
        $(
          ".download-link > div:nth-child(2) > div > table > tbody >  tr:nth-child(1) > td:nth-child(3) > a"
        )
          .attr("href")
          .split("url=")[1]
      ),
    };
    console.log(result);
    return result;
  } catch (err) {
    result = {
      status: false,
      msg: "Error: Invalid URL!",
    };
    console.log(result);
    return result;
  }
}

async function igStalk(username) {
  try {
    const { data, status } = await axios.get(
      `${baseSSS}api/ig/userInfoByUsername/${username}`
    );
    if (data.result.user.pronouns.length === 0) {
      var pronoun = "";
    } else {
      const splPron = data.result.user.pronouns;
      const addSlash = splPron.join("/");
      var pronoun = addSlash;
    }
    const res = data.result.user;
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
    };
    return result;
  } catch (err) {
    return (result = {
      status: false,
      creator: "Thoriq Azzikra",
      message: "Tidak dapat menemukan akun",
    });
    console.log(result);
  }
}

async function similarBand(query) {
  try {
    const { data } = await axios.get(`https://www.music-map.com/${query}`);
    let result = [];
    const $ = cheerio.load(data);
    $("#gnodMap > a").each(function () {
      result.push($(this).text());
    });
    return result;
  } catch {
    const result = {
      status: false,
      message: "Error, i can't find similar band that you looking for",
    };
    console.log(result);
    return result;
  }
}

const listCerpen = async () => {
  const { data } = await axios.get(baseCerpen);
  let result = [];
  const $ = cheerio.load(data);
  $("#content > article > strong > a").each(function () {
    result.push($(this).attr("href"));
  });
  const rndm = pickRandom(result);
  return rndm;
};

async function getCerpen() {
  try {
    const getUrlCerpen = await listCerpen();
    const { data } = await axios.get(getUrlCerpen);
    const $ = cheerio.load(data);
    const result = {
      status: true,
      title: $("#content > article > h1").text(),
      creator: $("#content > article > a:nth-child(2)").text(),
      category: $("#content > article > a:nth-child(4)").text(),
      cerpen: $("#content > article > p").text(),
    };
    return result;
  } catch {
    const result = {
      status: false,
      message: "Unknown error occurred",
    };
    console.log(result);
    return result;
  }
}

async function otakuDesuSearch(query) {
  const { data } = await axios.get(
    `${baseOtakudesu}?s=${query}&post_type=anime`
  );
  let i = 0;
  let result = { status: true, data: [] };
  const $ = cheerio.load(data);
  $(".page > ul > li").each(function () {
    result.data.push({
      title: $(this).find("h2 > a").text().split(" Subtitle")[0],
      status: $(this).find("div:nth-child(4)").text().split(" : ")[1],
      genre: $(this).find("div:nth-child(3)").text().split(" : ")[1],
      rating: $(this).find("div:nth-child(5)").text().split(" : ")[1],
      thumbnail: $(this).find("img").attr("src"),
      url: $(this).find("h2 > a").attr("href"),
    });
  });
  if (result.data.length === 0) {
    const result = {
      status: false,
      message: "Couldn't find the anime you looking for",
    };
    console.log(result);
    return result;
  }
  return result;
}

async function filmApikS(query) {
  // Search function
  const { data } = await axios.get(`${baseFilmApik}?s=${query}`);
  const $ = cheerio.load(data);
  let result = { status: true, data: [] };
  $(".search-page > .result-item > article").each(function () {
    result.data.push({
      title: $(this)
        .find(".details > .title > a")
        .text()
        .replace("Nonton Film ", "")
        .split(" Subtitle")[0]
        .split(" Sub")[0],
      rating: $(this)
        .find(".details > .meta > span")
        .text()
        .replace("IMDb ", "")
        .replace("TMDb ", ""),
      thumbnail: $(this).find(".image > div > a > img").attr("src"),
      url: $(this).find(".image > div > a").attr("href"),
      synopsis: $(this).find(".details > .contenido > p").text(),
    });
  });
  if (result.data.length === 0) {
    const result = {
      status: false,
      message: "Couldn't find the movie you looking for",
    };
    console.log(result);
    return result;
  }
  return result;
}

async function filmApikDl(url) {
  // Get Movie Url Download
  const { data } = await axios.get(`${url}/play`);
  let result = {
    status: true,
    creator: "Thoriq Azzikra",
    Url: {},
  };
  const $ = cheerio.load(data);
  $(".box_links #download > .links_table > .fix-table > center > a").each(
    function () {
      let provider = $(this).text().split(" ")[1];
      let url = $(this).attr("href");
      result.Url[provider] = url;
    }
  );
  if (Object.keys(result.Url).length === 0) {
    const result = {
      status: false,
      message: "Couldn't find the download link",
    };
    console.log(result);
    return result;
  }
  return result;
}

module.exports = {
  cekResi,
  tiktokdl,
  similarBand,
  pindl,
  igStalk,
  getCerpen,
  filmApikDl,
  filmApikS,
  otakuDesuSearch,
  igdl,
};