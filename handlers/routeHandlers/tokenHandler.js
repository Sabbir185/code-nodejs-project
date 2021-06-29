// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');
const { createRandomToken } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.tokenHandler = (requestProperties, callback) => {
    const acceptMethods = ['get', 'post', 'put', 'delete'];
    if (acceptMethods.indexOf(requestProperties.method) > -1) {
        handler._token[requestProperties.method](requestProperties, callback);
    } else {
        callback(405)
    }
}


handler._token = {};


handler._token.post = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone && password) {
        data.read('users', phone, (err1, userData) => {
            const hashedPassword = hash(password);
            if (hashedPassword === parseJSON(userData).password) {
                const tokenId = createRandomToken(20);
                const expires = Date.now() + 60 * 60 * 1000;
                const tokenObject = {
                    phone,
                    id: tokenId,
                    expires
                }
                data.create('tokens', tokenId, tokenObject, (err2) => {
                    if (!err2) {
                        callback(200, tokenObject)
                    } else {
                        callback(500, {
                            error: 'There was a problem in your server side'
                        })
                    }
                })
            } else {
                callback(400, {
                    error: 'Password is not valid!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have an problem in your side!'
        })
    }
};



handler._token.get = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
        data.read('tokens', id, (err, tokenData) => {
            const token = { ...parseJSON(tokenData) }
            if (!err && token) {
                callback(200, token)
            } else {
                callback(404, {
                    error: 'requested token was not found!'
                })
            }
        })
    } else {
        callback(404, {
            error: 'requested token was not found!'
        })
    }
};



handler._token.put = (requestProperties, callback) => {
    const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length === 20 ? requestProperties.body.id : false;

    const extend = typeof (requestProperties.body.extend) === 'boolean' && requestProperties.body.extend === true ? true : false;

    if(id && extend) {
        data.read('tokens', id, (err1, tokenData)=>{
            const tokenObject = parseJSON(tokenData);
            if(tokenObject.expires > Date.now() ) {
                tokenObject.expires = Date.now() + 60 * 60 * 1000;
                data.update('tokens', id, tokenObject, (err2)=>{
                    if(!err2) {
                        callback(200,{
                            Message: 'token has updated successfully!'
                        })
                    } else {
                        callback(500, {
                            Error: 'There was a problem in server!'
                        })
                    }
                })
            } else {
                callback(400, {
                    Error: 'token already expired!'
                })
            }
        })
    } else {
        callback(400, {
            Error: 'There was a problem in you request!'
        })
    }
};



handler._token.delete = (requestProperties, callback) => {
    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if(id) {
        // lookup data
        data.read('tokens', id, (err1, tokenData)=>{
            if(!err1 && tokenData) {
                data.delete('tokens', id, (err2)=>{
                    if(!err2){
                        callback(200, {
                            message: 'Delete successful!'
                        })
                    }else{
                        callback(500, {
                            error: 'there was a problem in your server side!'
                        })
                    }
                })
            } else {
                callback(500, {
                    error: 'there was a problem in your server side!'
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your request!'
        })
    }
};



module.exports = handler;