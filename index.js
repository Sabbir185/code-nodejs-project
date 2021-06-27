// dependencies
const http = require('http');
const {handleReqRes} = require('./helpers/handleReqRes')
const environment = require('./helpers/environment')
const data = require('./lib/data')


// app object - module scaffolding
const app = {};


// configuration
app.config = {
    port: 3000,
};


/*
    // testing our file system
    data.create('test', 'newFile', {name:'sabbir', dept:'cse'}, (err)=>{
        console.log(err)
    });
    data.read('test', 'newFile', (err, data)=>{
        console.log(err, data);
    });
    data.update('test', 'newFile', {name:'Nazib', dept:'cse'}, (err)=>{
        console.log(err)
    });
*/


// create server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(app.config.port, () => {
        console.log(`listening to port ${app.config.port}`)
    })
}


// handle request response
app.handleReqRes = handleReqRes


// start server
app.createServer();