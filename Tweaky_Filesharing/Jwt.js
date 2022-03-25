const {sign, varify} = require('jsonwebtoken')

const createToken = (data) =>{
    const jwtToken = sign({data},
        "isitworking");

    return jwtToken;
}

module.exports = { createToken };