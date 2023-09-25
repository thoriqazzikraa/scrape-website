# Install
```sh
> npm i scrape-websitee
```

# Usage
```js
const scrape = require("scrape-websitee")
```

# Endpoints
```js
{
  tools: {
    uploadFile, // (buffer)
    enhanceImg, // (url)
    cekResi, // (kurir, resi)
    tiktokTts, // (query)
    ttsModel, 
  },
  downloader: {
    tiktokHD, // (url)
    soundcloud, // (url)
    spotify, // (url)
    igStory, // (username)
    twitterdl2, // (url)
    igdl2, // (url)
    threads, // (url)
    fbdl, // (url)
    twitterdl, // (url)
    tiktokdl, // (url)
    pindl, // (url)
    igdl, // (url)
  },
  search: {
    similarSongs, // (query)
    findSongs, // (query)
    lyrics, // (query)
    similarBand, // (query)
    igStalk, // (query)
    filmApikS, // (query)
    filmApikDl, // (url)
    otakuDesuSearch, // (query)
  },
  random: {
    anime: {
     neko,
     waifu,
     shinobu
    },
    truthOrDare, // (language) default: "id", or you can find support languages in here https://psycatgames.com/app/truth-or-dare/
    getCerpen,
    getCerpenHorror,
  },
  ai: {
    textToImage, // (query)
  },
}
```
