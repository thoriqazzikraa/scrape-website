const axios = require("axios");
const cheerio = require("cheerio");
const indoDrama = "https://id.indodrama.net/";
const base21 = "https://terbit21.art/";
const baseFilmApik = "https://filmapik21.live/";
const baseOtakudesu = "https://otakudesu.lol/";
const baseCerpen = "http://cerpenmu.com/100-cerpen-kiriman-terbaru";
const baseSSS = "https://instasupersave.com/";

const { num } = require("./function");

const pickRandom = async (ext) => {
  return ext[Math.floor(Math.random() * ext.length)];
};

async function threads(url) {
  try {
    const { data } = await axios.get(
      `https://api.threadsphotodownloader.com/v2/media?url=${url}`
    );
    return data;
  } catch (err) {
    return String(err);
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
        "x-requested-with": "XMLHttpRequest",
      },
    });
    const $ = cheerio.load(data.data);
    let result = [];
    $(
      "#fbdownloader > div.tab-wrap > div:nth-child(5) > table > tbody > tr"
    ).each(function () {
      if ($(this).find("td:nth-child(2)").text() === "Yes") {
        var link = $(this)
          .find("td:nth-child(3) > button")
          .attr("data-videourl");
      } else {
        var link = $(this).find("td:nth-child(3) > a").attr("href");
      }
      result.push({
        quality: $(this).find("td.video-quality").text().split("p")[0],
        render: $(this).find("td:nth-child(2)").text(),
        url: link,
      });
    });
    if (result.length === 0) {
      const result = {
        status: false,
        message: "Couldn't fetch data of url",
      };
      return result;
    }
    return result.filter((filter) => filter.render === "No");
  } catch (err) {
    const result = {
      status: false,
      message: `Couldn't fetch data of url\n\n${String(err)}`,
    };
    console.log(result);
    return result;
  }
}

async function twitterdl(url) {
  const { data } = await axios.get(`https://twitsave.com/info?url=${url}`);
  let $ = cheerio.load(data);
  let result = [];
  $("div.origin-top-right > ul > li").each(function () {
    result.push({
      width: $(this)
        .find("a > div > div > div")
        .text()
        .split("Resolution: ")[1]
        .split("x")[0],
      height: $(this)
        .find("a > div > div > div")
        .text()
        .split("Resolution: ")[1]
        .split("x")[1],
      url: $(this).find("a").attr("href"),
    });
  });
  if (result.length === 0 || result.length === null) {
    const result = {
      status: false,
      message: "Tidak dapat menemukan video",
    };
    return result;
  }
  resolt = result.sort(function (a, b) {
    return a.height - b.height;
  });
  arrayResult = resolt[resolt.length - 1];
  return resolt.filter((video) => video.width === arrayResult.width);
}

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
    const getUdid = async () => {
      const { data } = await axios.get(`https://tikdown.org`);
      let $ = cheerio.load(data);
      return $("meta:nth-child(2)").attr("content");
    };
    const { data } = await axios.get(
      `https://tikdown.org/getAjax?url=${url}&_token=${getUdid}`
    );
    let $ = cheerio.load(data.html);
    let result = { status: true, media: [] };
    $(
      "div.download-result > .download-links > div.button-primary-gradient"
    ).each(function () {
      result.media.push($(this).find("a").attr("href"));
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

async function getCerpenHorror() {
  try {
    const getUrl = async () => {
      const randomNumber = Math.floor(Math.random() * 127);
      const { data } = await axios.get(
        `https://cerpenmu.com/category/cerpen-horor-hantu/page/${randomNumber}`
      );
      const $ = cheerio.load(data);
      let result = [];
      $("div#wrap > #content > article > article").each(function () {
        result.push($(this).find("h2 > a").attr("href"));
      });
      return pickRandom(result);
    };
    const url = await getUrl();
    const { data } = await axios.get(url);
    let $ = cheerio.load(data);
    const result = {
      status: true,
      title: $("#content > article > h1").text(),
      creator: $("#content > article > a:nth-child(2)").text(),
      category: $("#content > article > a:nth-child(4)").text(),
      story: $("#content > article > p").text().split("Cerpen Karangan")[0],
    };
    return result;
  } catch (err) {
    const result = {
      status: false,
      message: String(err),
    };
  }
}
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
  threads,
  getCerpenHorror,
  fbdl,
  twitterdl,
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
