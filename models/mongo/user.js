const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const crypto = require('crypto');
const bluebird = require('bluebird');
const pbkdf2Async = bluebird.promisify(crypto.pbkdf2);
const SALT = require('../../cipher').PASSWORD_SALT;

const UserSchema = new Schema({
  name: {type: String, require: true, unique: true},
  age: {type: Number, max:[90, 'NoBody over 90 could use this']},
  password: String,
  phoneNumber: String
});

const DEFAULT_PROJECTION = {password: 0, phoneNumber: 0, __v: 0};

const UserModel = mongoose.model('user', UserSchema);

async function createANewUser(params) {
  const user = new UserModel({name: params.name, age: params.age, password: params.password, phoneNumber: params.phoneNumber});
  user.password = await pbkdf2Async(params.password, SALT, 512, 128, 'sha1')
    .then(r => r.toString())
    .catch(e=>{
      console.log(e);
      throw new Error('error');
    });

  let created = await user.save()
    .catch(e => {
      console.log(e);
      switch (e.code){
        case 11000:
          throw new Error('someone has picked that name, choose an other!');
          break;
        default:
          throw new Error(`error creating user ${JSON.stringify(params)}`);
          break;
      }
    });
  return {
    _id: created._id,
    name: created.name,
    age: created.age
  }
}

async function getUsers(params = {page: 0, pageSize: 10}) {
  let flew = UserModel.find({});
  flew.select(DEFAULT_PROJECTION);
  flew.skip(params.page * params.pageSize);
  flew.limit(params.pageSize);
  return await flew
    .catch(e => {
      console.log(e);
      throw new Error('error getting users from db');
    })
}

async function getUserById(userId) {
  return await UserModel.findOne({_id: userId})
    .select(DEFAULT_PROJECTION)
    .catch(e=>{
      console.log(e);
      throw new Error(`error getting user by id: ${userId}`);
    })
}
async function updateUserById(userId, update) {
  return await UserModel.findOneAndUpdate({_id:userId}, update, {new: true})
    .select(DEFAULT_PROJECTION)
    .catch(e=>{
      console.log(e);
      throw new Error(`error updating user by id: ${userId}`);
    })
}

async function login(phoneNumber, password) {
  password = await pbkdf2Async(password, SALT, 512, 128, 'sha1')
    .then(r => r.toString())
    .catch(e=>{
      console.log(e);
      throw new Error('error');
    });

  const user = await UserModel.findOne({phoneNumber: phoneNumber, password: password})
    .select(DEFAULT_PROJECTION)
    .catch(e =>{
      console.log(`error logging in, phoneNumber ${phoneNumber}`);
      throw new Error('error');
    });

  if (!user) {
    throw new Error('No such user!');
  }
  return user;
}

module.exports= {
  model: UserModel,
  createANewUser,
  getUsers,
  getUserById,
  updateUserById,
  login
};