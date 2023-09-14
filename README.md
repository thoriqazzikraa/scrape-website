# Install
`npm i scrape-websitee`

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
    findSongs, // (query)
    lyrics, // (query)
    similarBand, // (query)
    igStalk, // (query)
    filmApikS, // (query)
    filmApikDl, // (url)
    otakuDesuSearch, // (query)
  },
  random: {
    getCerpen,
    getCerpenHorror,
  },
  ai: {
    textToImage, // (query)
  },
}
```
