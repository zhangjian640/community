class BaseHTTPError extends Error {
  constructor (msg, OPCode, httpCode, httpMsg) {
    super(msg);
    this.OPCode = OPCode;
    this.httpCode = httpCode;
    this.httpMsg = httpMsg;
    this.name = 'BaseHTTPError';
  }

  static get['DEFAULT_OPCODE'] () {
    return 10000;
  }
}

class InternalError extends BaseHTTPError {
  constructor (msg) {
    const OPCode = 10001;
    const httpMsg = '服务器出错';
    super(msg, OPCode, 500, httpMsg);

  }

}

class ValidationError extends BaseHTTPError {
  constructor (path, reason) {
    const OPCode = 20000;
    const httpCode = 400;
    super(`error validating param, path: ${path}, reason: ${reason}`, OPCode, httpCode, '参数错误，请检查后再尝试！');
    this.name = 'ValidationError';
  }
}

class DuplicatedUserNameError extends ValidationError {
  constructor (username) {
    super('username', `duplicate user name: ${ username }`);
    this.httpMsg = '该用户名已被使用，换一个试试';
    this.OPCode = 20001;
  }
}

class DuplicatedUserError extends ValidationError {
  constructor (username) {
    super('username', `duplicate user name: ${ username }`);
    this.httpMsg = '您还未注册';
    this.OPCode = 20002;
  }
}

module.exports = {
  BaseHTTPError,
  InternalError,
  ValidationError,
  DuplicatedUserNameError,
  DuplicatedUserError
};