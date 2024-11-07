const fs = require("fs/promises")
const fPath = './log'

const writeToFile = async (v) => {
    try{
        const fd = await fs.open(fPath,'a')
        await fd.writeFile(v)
        await fd.close()
    }catch(e){
        console.log(e)
    }
}

module.exports = {
    writeToFile
}