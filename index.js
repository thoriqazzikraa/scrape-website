const axios = require("axios");
const version = require("./package.json").version;
const cheerio = require("cheerio");
const indoDrama = "https://id.indodrama.net/";
const base21 = "https://terbit21.art/";
const baseFilmApik = "https://filmapik21.live/";
const baseOtakudesu = "https://otakudesu.lol/";
const baseCerpen = "http://cerpenmu.com/100-cerpen-kiriman-terbaru";
const baseSSS = "https://instasupersave.com/";
const { fromBuffer, fileTypeStream } = require("file-type-cjs-fix");
const fs = require("fs");
const formData = require("form-data");
const { num, checkUrl } = require("./function");

const pickRandom = async (ext) => {
  return ext[Math.floor(Math.random() * ext.length)];
};

async function lyrics(query) {
  try {
    const search = async () => {
      const { data } = await axios.get(
        "https://search.azlyrics.com/search.php?q=" +
          query +
          "&x=e9a1e866a967a73ef3f5fab168d365419b4a7b180449e393958bd041c3ec5d1f"
      );
      let $ = cheerio.load(data);
      let url = $(
        "div.row > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > a"
      ).attr("href");
      let artis = $(
        "div.row > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > a > b"
      ).text();
      let title = $(
        "div.row > div > div:nth-child(1) > table > tbody > tr:nth-child(1) > td > a > span"
      )
        .text()
        .replace(/"/g, " ");
      const result = {
        title: `${artis} - ${title}`,
        url: url,
      };
      return result;
    };
    const { title, url } = await search(query);
    const { data } = await axios.get(url);
    let $ = cheerio.load(data);
    if (
      $("div.row > div:nth-child(2) > div:nth-child(8)").text().trim() === ""
    ) {
      var lyric = $("div.row > div:nth-child(2) > div:nth-child(10)")
        .text()
        .trim();
    } else {
      var lyric = $("div.row > div:nth-child(2) > div:nth-child(8)")
        .text()
        .trim();
    }
    const result = {
      status: true,
      lyric: `${title}\n\n${lyric}`,
    };
    return result;
  } catch (err) {
    const result = {
      error: true,
      message: `Cannot find the lyrics`,
    };
    console.log(result);
    return result;
  }
}

function ttsModel() {
  const model = {
    source: `You can find model on this web https://tiktokvoicegenerator.com/`,
    englishUS: {
      female: "en_us_001",
      male1: "en_us_006",
      male2: "en_us_007",
      male3: "en_us_009",
      male4: "en_us_010",
    },
    englishUK: {
      male1: "en_uk_001",
      male2: "en_uk_003",
    },
    englishAU: {
      female1: "en_au_001",
      male1: "en_au_002",
    },
    french: {
      male1: "fr_001",
      male2: "fr_002",
    },
    german: {
      female1: "de_001",
      male1: "de_002",
    },
    spanish: {
      male1: "es_002",
    },
    spanishMX: {
      male1: "es_mx_002",
    },
    portugueseBR: {
      female2: "br_003",
      female3: "br_004",
      male1: "br_005",
    },
    indonesian: {
      female1: "id_001",
    },
    japanese: {
      female1: "jp_001",
      female2: "jp_003",
      female3: "jp_005",
      male1: "jp_006",
    },
    korean: {
      male1: "kr_002",
      male2: "kr_004",
      female1: "kr_003",
    },
    chara: {
      ghostFace: "en_us_ghostface",
      chewbacca: "en_us_chewbacca",
      cepo: "en_us_c3po",
      stitch: "en_us_stitch",
      stormtrooper: "en_us_stormtrooper",
      rocket: "en_us_rocket",
    },
    singing: {
      alto: "en_female_f08_salut_damour",
      tenor: "en_male_m03_lobby",
      sunshine: "en_male_m03_sunshine_soon",
      warmy: "en_female_f08_warmy_breeze",
      glorious: "en_female_ht_f08_glorious",
      itGoesUp: "en_male_sing_funny_it_goes_up",
      chipmunk: "en_male_m2_xhxs_m03_silly",
      dramatic: "en_female_ht_f08_wonderful_world",
    },
  };
  return model;
}

async function tiktokTts(text, model) {
  try {
    const modelVoice = model ? model : "en_us_001";
    const { status, data } = await axios(
      `https://tiktok-tts.weilnet.workers.dev/api/generation`,
      {
        method: "post",
        data: { text: text, voice: modelVoice },
        headers: {
          "content-type": "application/json",
        },
      }
    );
    return data;
  } catch (err) {
    console.log(err.response.data);
    return err.response.data;
  }
}

async function textToImage(text) {
  try {
    const { data } = await axios.get(
      "https://tti.photoleapapp.com/api/v1/generate?prompt=" + text
    );
    const enhanceImages = await enhanceImg(data.result_url, 2);
    const result = {
      status: true,
      url: enhanceImages.url,
    };
    return result;
  } catch (err) {
    const result = {
      status: false,
      message: String(err),
    };
    console.log(result);
    return result;
  }
}

async function uploadFile(buffer) {
  const { ext, mime } = await fromBuffer(buffer);
  const filePath = `temp/${Date.now()}.${ext}`;
  await fs.writeFileSync(filePath, buffer);
  const fileData = fs.readFileSync(filePath);
  try {
    const form = new formData();
    form.append("files[]", fileData, `${Date.now()}.${ext}`);
    const { data } = await axios(`https://pomf2.lain.la/upload.php`, {
      method: "post",
      data: form,
    });
    return data;
  } catch (err) {
    console.log(err);
    return String(err);
  } finally {
    fs.unlinkSync(filePath);
  }
}

async function enhanceImg(url, scale) {
  const scaleNumber = scale ? scale : 2;
  const { data } = await axios(`https://toolsapi.spyne.ai/api/forward`, {
    method: "post",
    data: {
      image_url: url,
      scale: scaleNumber,
      save_params: {
        extension: ".png",
        quality: 95,
      },
    },
    headers: {
      "content-type": "application/json",
      accept: "*/*",
    },
  });
  return data;
}

async function twitterdl2(url) {
  try {
    const result = { status: true, type: "", media: [] };
    const { data } = await axios(`https://savetwitter.net/api/ajaxSearch`, {
      method: "post",
      data: { q: url, lang: "en" },
      headers: {
        accept: "*/*",
        "user-agent": "PostmanRuntime/7.32.2",
        "content-type": "application/x-www-form-urlencoded",
      },
    });
    let $ = cheerio.load(data.data);
    if ($("div.tw-video").length === 0) {
      $("div.video-data > div > ul > li").each(function () {
        result.type = "image";
        result.media.push(
          $(this).find("div > div:nth-child(2) > a").attr("href")
        );
      });
    } else {
      $("div.tw-video").each(function () {
        result.type = "video";
        result.media.push({
          quality: $(this)
            .find(".tw-right > div > p:nth-child(1) > a")
            .text()
            .split("(")[1]
            .split(")")[0],
          url: $(this)
            .find(".tw-right > div > p:nth-child(1) > a")
            .attr("href"),
        });
      });
    }
    return result;
  } catch (err) {
    const result = {
      status: false,
      message: "Media not found!" + String(err),
    };
    console.log(result);
    return result;
  }
}

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
    console.log(result);
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

async function igdl2(url) {
  try {
    let result = { status: true, media: [] };
    const { data } = await axios(
      `https://www.y2mate.com/mates/analyzeV2/ajax`,
      {
        method: "post",
        data: {
          k_query: url,
          k_page: "Instagram",
          hl: "id",
          q_auto: 0,
        },
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": "PostmanRuntime/7.32.2",
        },
      }
    );
    await data.links.video.map((video) => result.media.push(video.url));
    return result;
  } catch (err) {
    const result = {
      status: false,
      message: `Media not found`,
    };
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
  creator: "Thoriq Azzikra",
  version: version,
  tools: {
    uploadFile,
    enhanceImg,
    cekResi,
    tiktokTts,
    ttsModel,
  },
  downloader: {
    twitterdl2,
    igdl2,
    threads,
    fbdl,
    twitterdl,
    tiktokdl,
    pindl,
    igdl,
  },
  search: {
    lyrics,
    similarBand,
    igStalk,
    filmApikS,
    filmApikDl,
    otakuDesuSearch,
  },
  random: {
    getCerpen,
    getCerpenHorror,
  },
  ai: {
    textToImage,
  },
};
