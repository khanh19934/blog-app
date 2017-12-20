const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const comment = require('./comment');

const BlogSchema = new Schema({
	author: { type: Schema.Types.ObjectId, ref: 'user' },
    title:String,
    describe:String,
    content:String,
    comment:[{type: Schema.Types.ObjectId,ref:'Comment'}],
    likes:{
    	type:Number,
    	default:0
    }
});

var Blog  = mongoose.model('Blog', BlogSchema);



module.exports = Blog;