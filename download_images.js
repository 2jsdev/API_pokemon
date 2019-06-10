const fs = require('fs')  
const Path = require('path')  
const axios = require('axios')

 const downloadImage = async (url, name) => {
  const path = Path.resolve(__dirname, 'images', `${name}.png`)
  const writer = fs.createWriteStream(path)

  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  })

  response.data.pipe(writer)

  return new Promise((resolve, reject) => {
    writer.on('finish', resolve)
    writer.on('error', reject)
  })
}

module.exports.downloadImage = downloadImage