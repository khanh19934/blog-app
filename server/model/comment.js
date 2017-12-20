const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	content:String,
	user:{
		type:Schema.Types.ObjectId,
		ref:'user'
	},
	blogPost:{
		type:Schema.Types.ObjectId,
		ref:'Blog'
	},
	created: { type: Date, default: Date.now }
});
CommentSchema.pre('save',function(next){
	if (this.isNew) this.created = new Date;
	next();
});

const Comment = mongoose.model('Comment',CommentSchema);
module.exports = Comment;