const axios = require('axios')
const postman_api_key = process.env.POSTMAN_API_KEY


const config = {
    method: 'get',
    url: 'https://api.getpostman.com/collections/',
    headers: { 
      'X-Api-Key': postman_api_key
    }
  };

async function main(args) {
    config.url = `${config.url}${args.collection_uid}`
    return axios(config)
        .then(res => ({ body: res.data }))
        .catch(error => ({ body: error.message }))
}

module.exports = { main }
