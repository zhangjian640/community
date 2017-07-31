const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReplySchema = new Schema({
  creator: Schema.Types.ObjectId, // 回复人
  content: String  // 回复内容
});

const TopicSchema = new Schema({
  creator: {type: String, required: true}, // 文章作者
  title: String,// 文章标题
  content: String,// 文章内容
  replyList: [ReplySchema]
});

const TopicModel = mongoose.model('topic', TopicSchema);

async function createANewTopic(params) {
  const topic = new TopicModel({
    creator: params.creator,
    title: params.title,
    content: params.content
  });
  return await topic.save()
    .catch(e => {
      console.loe(e);
      throw new Error(`error creating topic ${JSON.stringify(params)}`);
    });
}

async function getTopics(params) {
  let flew = TopicModel.find({});
  flew.skip(params.page * params.pageSize);
  flew.limit(params.pageSize);
  return await flew
    .catch(e => {
      console.log(e);
      throw new Error('error getting topics from db');
    })
}

async function getTopicById(topicId) {
  return await TopicModel.findOne({_id: topicId})
    .catch(e => {
      console.log(e);
      throw new Error(`error getting topic by id: ${topicId}`);
    })
}
async function updateTopicById(topicId, update) {
  return await TopicModel.findOneAndUpdate({_id: topicId}, update, {new: true})
    .catch(e => {
      console.log(e);
      throw new Error(`error updating topic by id: ${topicId}`);
    })
}

async function replyATopic(params) {
  return await TopicModel.findOneAndUpdate(
    {_id: params.topicId},
    {
      $push: {
        replyList: {
          creator: params.creator,
          content: params.content
        }
      }
    }, {new: true})
    .catch(e => {
      console.log(e);
      throw new Error(`error reply topic: ${params}`);
    })
}

module.exports = {
  model: TopicModel,
  createANewTopic,
  getTopics,
  getTopicById,
  updateTopicById,
  replyATopic
};
