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
    cekResi, // (kurir, resi)
    tiktokTts, // (query)
    ttsModel, 
  },
  downloader: {
    tiktokdl2, // (url)
    soundcloud, // (url)
    spotify, // (url)
    igStory, // (username)
    igStory2, // (username)
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
    lyrics2, // (query)
    similarBand, // (query)
    igStalk, // (username)
    igStalk2, // (username)
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
  truthOrDare,
  getCerpen,
  getCerpenHorror,
  randomTiktok // (username)
  },  
  ai: {
    textToImage, // (query)
  },
}
```
