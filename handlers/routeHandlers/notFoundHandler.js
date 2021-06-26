// modules scaffolding
const handler = {};

handler.notFoundHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(404, {
        message: 'your requested url was not found!',
    });
}

module.exports = handler;