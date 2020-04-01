var crypto = require('crypto');

exports.hash = function(mingwen){
  let hash = crypto.createHmac('sha256', mingwen).digest('hex');
  return hash
}