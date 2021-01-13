const axios = require('axios')
const postman_api_key = process.env.POSTMAN_API_KEY


const config = {
    method: 'post',
    url: 'https://api.getpostman.com/collections',
    headers: { 
      'X-Api-Key': postman_api_key,
      'Content-Type': 'application/json'
    }
  };

async function main(args) {
    config.data = args.data
    return axios(config)
        .then(res => ({ body: res.data }))
        .catch(error => ({ body: error.message }))
}

module.exports = { main }
