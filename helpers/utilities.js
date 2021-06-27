// dependencies
const crypto = require('crypto');

// module scaffolding
const utilities = {};

utilities.parseJSON = (jsonString) => {
    let output;

    try {
        output = JSON.parse(jsonString);
    } catch (error) {
        output = {};
    }

    return output;
}

utilities.hash = (str) => {
    if(typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac("sha256", "kjkjdklfjasd").update(str).digest("hex");
        
        return hash;
    }

    return false;
}


module.exports = utilities;