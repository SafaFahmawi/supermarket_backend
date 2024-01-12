const jwt = require('jsonwebtoken');
const crypto = require('crypto');

//calculates the Unix timestamp for the current moment plus 24 hours
const jwtTokenExpirationTime = Math.floor(Date.now() / 1000) + 60 * 60 * 24;
const jwtSecret = crypto.randomBytes(32).toString('hex');//This is the secret key used to sign the JWT. It should be kept secure and should not be exposed or shared publicly

//tokens include a header, payload, and signature. Within this payload is information about the user.
function createToken(payload) {
  const token = jwt.sign(payload, jwtSecret, {
    algorithm: 'HS256',//to create a digital signature. 
    allowInsecureKeySizes: false,//it indicates that the system should not allow insecure key sizes.
    expiresIn: jwtTokenExpirationTime
  });//Create and send JWT

  return token;
}

module.exports = {
  createToken
};
