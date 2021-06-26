//dependencies
const fs = require('fs')
const path = require('path')

// module scaffolding
const lib = {};

// base directory of the file
lib.basedir = path.join(__dirname, '../.data/')

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file to write
    fs.open(`${lib.basedir+dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if(!err && fileDescriptor) {
            // data to string
            const stringData = JSON.stringify(data);

            // write data to file and close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if(!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if(!err3) {
                            callback(false)
                        } else {
                        callback('Error closing the new file!')
                        }
                    })
                } else {
                    callback('Error writing to new file')
                }
            })
        } else {
            callback('There was an error, file may already exit!')
        }
    });
}

module.exports = lib