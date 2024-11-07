const filesLib = require('./filesLib.js')

const logger = (request, r, next) => {
    const date = new Date()
    const lDate = `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`
    const log = `${lDate}: ${request.method} ${request.url}\n`
    filesLib.writeToFile(log)
    console.log(log)
    next()
}

module.exports = {
    logger
}