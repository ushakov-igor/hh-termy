const axios = require('axios');
const fs = require('fs')

const path = './areas.json'

const createAreasFile = () => {
    if (!fs.existsSync(path)) {
        axios.get('https://api.hh.ru/areas')
        .then(function (response) {
            const jsonString = JSON.stringify(response.data)
            fs.writeFile(path, jsonString, err => {
                if (err) {
                    console.log('Error writing file', err)
                } else {
                    console.log('Areas file successfully created!')
                }
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }
}

//TODO: Доделать позже, сейчас сделать просто с Text
const readAreasFile = (name) => {
    fs.readFile(path, 'utf8', (err, jsonString) => {
        if (err) {
            console.log("File read failed:", err)
            return
        }
        const jsonAreas = JSON.parse(jsonString)
        for(var country in jsonAreas) {
            if(JSON.parse(jsonString)[country].name === name) {
                console.log(JSON.parse(jsonString)[country])
                return;
            }
         }
    })
}

module.exports.createAreasFile = createAreasFile;
module.exports.readAreasFile = readAreasFile;