const Generate = require('generator')

async function main(args) {
    return new Generate({
        id: args.id || 'ncovstats',
        key: process.env.POSTMAN_API_KEY,
        language: args.language || 'js',
        overwrite: true,
        deploy: true,
        deployForce: false,
        updateSource: true,
        clientCode: true,
        update: true,
        init: false,
    })
        .generate().then(res => ({ body: res.data }))
        .catch((error) => {
            console.log('Oops! Some Error Occurred, Please Try Again')
            logger.error(error)
        })
}

module.exports = { main }
