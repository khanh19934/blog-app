const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const validator = require('validator');
const _ = require('lodash');
const blogpost = require('./blog');
const Blog = require('./blog');
const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 8
    },
    name: {
        type: String
    },
    address: {
        type: String,
        trim: true
    },
    age: {
        type: String,
        trim: true
    },
    phoneNumber: {
        type: Number
    },
    blogPosts: [{
        type: Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    isAdmin:{
        type:Boolean,
        default:false
    }
});
 UserSchema.pre('save', function(next) {
    let user = this;
    if (user.isModified('password')) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email', 'name']);
};

const User = mongoose.model('user', UserSchema);
module.exports = User;