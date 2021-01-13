const axios = require('axios')
const postman_api_key = process.env.POSTMAN_API_KEY


const config = {
    method: 'post',
    url: 'https://api.getpostman.com/collections/merge',
    headers: { 
      'X-Api-Key': postman_api_key,
      'Content-Type': 'application/json'
    }
  };

async function main(args) {
    config.data = JSON.stringify({"strategy":"deleteSource","source":`${args.source_collection_uid}`,"destination":`${args.destination_collection_uid}`});
    return axios(config)
        .then(res => ({ body: res.data }))
        .catch(error => ({ body: error.message }))
}

module.exports = { main }
