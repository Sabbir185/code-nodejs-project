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
    if (typeof str === 'string' && str.length > 0) {
        const hash = crypto.createHmac("sha256", "kjkjdklfjasd").update(str).digest("hex");

        return hash;
    }

    return false;
}


utilities.createRandomToken = (strLength) => {
    let length = strLength;
    length = typeof strLength === 'number' && strLength > 0 ? strLength : false;
    if (length) {
        const possibleCharacters = 'abcdefghijklmnopqrstuvwyxz0123456789';
        let output = '';
        for (let i = 1; i <= length; i += 1) {
            const randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length))

            output += randomCharacter;
        }
        return output;
    }

    return false;
}


module.exports = utilities;