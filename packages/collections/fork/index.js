const axios = require('axios')
const postman_api_key = process.env.POSTMAN_API_KEY


const config = {
    method: 'post',
    url: 'https://api.getpostman.com/collections/fork/',
    headers: { 
      'X-Api-Key': postman_api_key,
      'Content-Type': 'application/json'
    }
  };

async function main(args) {
    config.url = `${config.url}${args.collection_uid}?workspace=${args.workspace_id}`
    config.data = JSON.stringify({"name":`${args.fork_name}`});
    return axios(config)
        .then(res => ({ body: res.data }))
        .catch(error => ({ body: error.message }))
}

module.exports = { main }
