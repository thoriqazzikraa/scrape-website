const { ai } = require("../index.js")

// text to picture
async function textToPicture(text) {
  const data = await ai.textToImage(text)
  console.log(data)
  return data
}
textToPicture("a girl standing on the field")
