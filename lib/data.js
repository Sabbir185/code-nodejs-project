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


// read data from file 
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    })
}


// update existing file
lib.update = (dir, file, data, callback) => {
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor)=>{
        if(!err && fileDescriptor) {
            const stringData = JSON.stringify(data);

            // truncate the file
            fs.ftruncate(fileDescriptor, (err2)=>{
                if(!err2) {
                    fs.writeFile(fileDescriptor, stringData, (err3)=>{
                        if(!err3){
                            fs.close(fileDescriptor, (err4)=>{
                                if(!err4){
                                    callback(false)
                                }else{
                                    callback('Error closing the file')
                                }
                            })
                        }else{
                            callback('Error writing the file')
                        }
                    })
                } else{
                    callback('Error truncating file')
                }
            })
        } else {
            callback('Error updating. File may not exist')
        }
    });
};


// delete existing file
lib.delete = (dir, file, callback) => {
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err)=>{
        if(!err){
            callback(false)
        }else{
            callback('error deleting file')
        }
    })
}


// export module
module.exports = lib