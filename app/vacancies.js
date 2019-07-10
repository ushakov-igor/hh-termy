const axios = require('axios');

const getVacancies = async (text) => {
    let vacanciesArray = []
    await axios.get('https://api.hh.ru/vacancies?text=' + encodeURI(text))
        .then(function (response) {
            const jsonString = response.data
            for(var l in jsonString.items) {
                vacanciesArray.push(jsonString.items[l]);
            }
        })
        .catch(function (error) {
            console.log(error);
        })

    return vacanciesArray
}

module.exports.getVacancies = getVacancies;