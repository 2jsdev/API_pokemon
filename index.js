const express = require('express')
const fs = require('fs')  
const axios = require('axios')
const { downloadImage } = require('./download_images')
const app = express()
const port = 3000

const pokeapi = 'https://pokeapi.co/api/v2/pokemon'

app.get('/images', async(req, res) => {
    const {name , imageType='front_default'} = req.query    
    if(!name){
        return res.status(400).send({
            error: 'name required'
        })
    }
    const url = `${pokeapi}/${name}`
    let pokemon = ''
    try {
        pokemon = await axios(url)
    } catch (exception) {
        if( exception.response.status == 404) {
            return res.status(404).send({
                error: 'not found'
            })
        }
    }
    const {sprites} = pokemon.data
    const fileName = `${name}_${imageType}`
    const filePath = `${__dirname}/images/${fileName}.png`    
    if(fs.existsSync(filePath)){
        console.log('from cache')
        return res.sendFile(filePath)
    }
    await downloadImage(sprites[imageType], fileName)
    res.sendFile(filePath)
})

app.listen(port, () => console.log(`listening on port localhost:${port}`))