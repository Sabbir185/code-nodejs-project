// dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities');
const { parseJSON } = require('../../helpers/utilities');

// module scaffolding
const handler = {};

handler.userHandler = (requestProperties, callback) => {
    const acceptMethods = ['get', 'post', 'put', 'delete'];
    if (acceptMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405)
    }
}


handler._user = {};


handler._user.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length == 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof (requestProperties.body.tosAgreement) === 'boolean' ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        // data read
        data.read('users', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                }

                data.create('users', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was created successful!'
                        })
                    } else {
                        callback(500, {
                            error: 'could not create object'
                        })
                    }
                })

            } else {
                callback(500, {
                    error: 'there was a problem in server side'
                })
            }
        })

    } else {
        callback(400, {
            error: 'You have an problem in your side!'
        })
    }
};



handler._user.get = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        data.read('users', phone, (err, userData) => {
            const user = { ...parseJSON(userData) }
            if (!err && user) {
                delete user.password;
                callback(200, user)
            } else {
                callback(404, {
                    error: 'requested user was not found!'
                })
            }
        })
    } else {
        callback(404, {
            error: 'requested user was not found!'
        })
    }
};



handler._user.put = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    if (phone) {
        if (firstName || lastName || password) {
            // read data from file
            data.read('users', phone, (err1, uData) => {
                const userData = { ...parseJSON(uData) };
                if (!err1) {
                    if(firstName) {
                        userData.firstName = firstName;
                    }
                    if(lastName) {
                        userData.lastName = lastName;
                    }
                    if(password) {
                        userData.password = hash(password);
                    }

                    data.update('users', phone, userData, (err2)=>{
                        if(!err2) {
                            callback(200, {
                                message: 'User was creates successfully!',
                            })
                        } else {
                            callback(500, {
                                error: 'There was a problem in server side',
                            })
                        }
                    })
                } else {
                    callback(400, {
                        error: 'You have a problem in your request!'
                    })
                }
            })
        } else {
            callback(400, {
                error: "You have a problem in request!"
            })
        }
    } else {
        callback(400, {
            error: "Invalid phone number. Please try again!"
        })
    }
};



handler._user.delete = (requestProperties, callback) => {
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if(phone) {
        // lookup data
        data.read('users', phone, (err1, userData)=>{
            if(!err1 && userData) {
                data.delete('users', phone, (err2)=>{
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