require('dotenv').config()

async function loadCredentialsFromCfg(){
    return `mongodb+srv://${process.env.login}:${process.env.pass}@${process.env.clusterName}.${process.env.clusterId}.mongodb.net/?retryWrites=true&w=majority`
}

module.exports = {
    loadCredentialsFromCfg
}