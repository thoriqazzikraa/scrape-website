const pickRandom = (ext) => {
  return ext[Math.floor(Math.random() * ext.length)]
}

module.exports = { pickRandom }
