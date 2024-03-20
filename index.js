const version = require("./package.json").version

module.exports = {
  creator: "Thoriq Azzikra",
  version: version,
  tools: require("./src/tools.js"),
  downloader: require("./src/downloader.js"),
  search: require("./src/search.js"),
  football: require("./src/football.js"),
  random: require("./src/random.js"),
  ai: require("./src/ai.js")
}
