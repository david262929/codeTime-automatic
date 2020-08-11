const {createDirIfNotExists, createFileIfNotExists} = require('./functions')
const path = require('path')
const fs = require('fs')
const allowed = {
    types: ['error', 'message'],
    modes: ['endpoint_main', 'endpoint_compress', 'worker_tasks', 'system_error']
}

const appendIntoLogFile = async (data, logFileName, type) => new Promise(resolve => {
    const LOG_DIR = path.resolve(`logs/`)
    createDirIfNotExists(LOG_DIR)
    const LOGFILE_PATH = `${LOG_DIR}/${logFileName}`
    createFileIfNotExists(LOGFILE_PATH)
    fs.appendFile(LOGFILE_PATH, `${type} : ${JSON.stringify(data)}\n Date : ${new Date()}\n------------------\n`, resolve)
})

const log = async (data, prefix = null, mode = 'endpoint_main', type = 'error') => {
    console.log({data, prefix, mode, type});
    if (!data) {
        throw("Not correct 'data'")
    }

    if (!allowed.modes.includes(mode)) {
        throw("Not Allowed 'log' mode")
    }

    if (!allowed.types.includes(type)) {
        throw("Not Allowed 'log' type")
    }

    try {
        if (prefix) {
            data = {[prefix]: data}
            await appendIntoLogFile(data, `${type}_${mode}.log`, type)
        }
    } catch (e) {
        log(
            {
                e,
                "details": {data, prefix, mode, type}
            },
            null,
            'system_error',
            'error'
        )
        throw("Something went wrong with logging, please see last logs")
    }
}


module.exports = log