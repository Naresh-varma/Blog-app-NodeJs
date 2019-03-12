const mongoose = require('mongoose');
//var uniqueValidator = require('mongoose-unique-validator');
const Schema = mongoose.Schema;
const blogSchema = new Schema({
    _id : mongoose.Schema.Types.ObjectId,
    title : {
        type : 'String',
        unique : true,
        required : true       
    },
    description : String,
    comments : [{type : mongoose.Schema.Types.ObjectId, ref: 'Comment'}]
});
//blogSchema.plugin(uniqueValidator);
module.exports = mongoose.model('Blog', blogSchema);