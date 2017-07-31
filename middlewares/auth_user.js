const JWT = require('jsonwebtoken');
const JWT_SECRET = require('../cipher').JWT_SECRET;

module.exports = function (options) {
  return function (req, res, next) {
    try{
      const auth = req.get('Authorization');
      if (!auth) {
        throw new Error('invalid auth!');
      }
      const authList = auth.split(' ');
      const token = authList[1];
      if (!auth || authList.length < 1) {
        res.statusCode = 401;
        next(new Error('invalid auth!'));
        return;
      }

      const obj = JWT.verify(token, JWT_SECRET);
      if (!obj || !obj._id || !obj.expire) {
        throw new Error('No auth!');
      }
      if (Date.now() - obj.expire > 0) {
        throw new Error('Token expire');
      }
      next();
    } catch(e) {
      res.statusCode = 401;
      next(e);
    }

  };
};