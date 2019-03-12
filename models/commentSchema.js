const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    user_id : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    blog_id : {type : mongoose.Schema.Types.ObjectId, ref : 'Blog'},
    description : String
});
module.exports = mongoose.model('Comment', commentSchema);