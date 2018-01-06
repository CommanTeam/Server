
const jwt = require('jsonwebtoken');

/*
 Modularize DB Connection
*/
module.exports = {
    // Issue jwt Token
    sign : function(email,nickname) {
        const options = {
            algorithm : "HS256",
            expiresIn : 60 * 60 * 24 * 30 //30 days
        };
        const payload = {
            email : email
        };
        let token = jwt.sign(payload, secretKey, options);
        return token;
    },
    // Check jwt
    verify : function(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        }
        catch(err) {
            if(err.message === 'jwt expired') console.log('expired token');
            else if(err.message === 'invalid token') console.log('invalid token');
        }
        if(!decoded) {
            return -1;
        }else {
            return decoded;
        }
    }
};
