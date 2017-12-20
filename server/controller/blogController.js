const User = require('../model/user');
const bcrypt = require('bcryptjs');
const Blog = require('../model/blog');
const mongoose = require('mongoose');
const Comment = require('../model/comment');
const Admin = require('../model/admin');
module.exports = {
    homePage(req, res) {
        res.render('pages/index', {
            session: req.session
        });
    },
    loginPage(req, res) {
        res.render('pages/login', {
            user: req.user,
            session: req.session
        });
    },
    signupPage(req, res) {
        res.render('pages/signup', {
            user: req.user,
            session: req.session
        });
    },
    async signupUser(req, res) {
        const userSignUp = new User(req.body);
        try {
            const user = await userSignUp.save();
            req.flash('success', 'Registration successfully');
            res.locals.message = req.flash();
            res.render('pages/signup', {
                user: req.user,
                session: req.session
            });

        } catch (e) {
            req.flash('error', 'Email already in use or not correctly!');
            res.locals.message = req.flash();
            res.render('pages/signup', {
                user: req.user,
                session: req.session
            });
        }
    },
    async loginUser(req, res) {
        const userLogin = req.body;
        try {
            const user = await User.findOne({ email: userLogin.email });

            const checkPass = await bcrypt.compare(userLogin.password, user.password);

            req.session.user = user;
            req.session.userId = user._id;
            req.session.email = user.email;
            req.session.name = user.name;
            req.session.blogPosts = user.blogPosts;
            req.session.isAdmin = user.isAdmin;
            res.redirect('/user');

        } catch (e) {
            req.flash('error', 'Email or password not correctly!');

        }
    },
    logout(req, res, next) {
        if (req.session) {
            // delete session object
            req.session.destroy(function(err) {
                if (err) {
                    return next(err);
                } else {
                    return res.redirect('/');
                }
            });
        }
    },
    async userPage(req, res) {
        const user = await User.findOne({ email: req.session.email });
        const blogPost = await Blog.find({}).populate('author');
        res.render('pages/user', {
            blog: blogPost,
            user: res.user,
            session: req.session,
            email: user.email,
            name: user.name,
            phoneNumber: user.phoneNumber,
            address: user.address,
            age: user.age
        });




    },
    async changeUserPass(req, res) {
        const user = req.body;
        try {
            const fecthUser = await User.findOne({ email: user.email });
            if (!fecthUser) {
                console.log('err cant not find email');
            } else {
                const checkPass = await bcrypt.compare(user.oldPassword, fecthUser.password);
                if (!checkPass) {
                    console.log('Wrong Pass');
                } else {
                    const changedPass = await User.update({ password: user.newPassword });
                    if (changedPass) {
                        res.redirect('/user');
                    } else {
                        console.log('Try again');
                    }
                }
            }
        } catch (e) {
            console.log(e);
        }
    },
    async updateUserInfo(req, res) {
        try {
            const updatedUser = await User.findByIdAndUpdate(req.session.userId, req.body);
            if (updatedUser) {
                res.redirect('/user');
            }
        } catch (e) {
            console.log(e);
        }


    },
    async deleteUser(req, res) {
        try {

            for (let i = 0; i < req.session.blogPosts.length; i++) {
                const deletedBlog = await Blog.findByIdAndRemove(req.session.blogPosts[i]);
                const deletedComment = await Comment.remove({ blogPost: req.session.blogPosts[i] });
            }

            const deleted = await User.findByIdAndRemove(req.session.userId);

        } catch (e) {
            console.log(e)
        }
    },
    async createBlog(req, res) {
        try {
            const blogpost = new Blog({
                author: req.session.userId,
                title: req.body.title,
                content: req.body.content,
                describe: req.body.describe
            });
            const result = await blogpost.save();
            const userBlog = await User.findById(req.session.userId);
            userBlog.blogPosts.push(result);
            const added = await userBlog.save();
            res.redirect('/blogmanagement');
        } catch (e) {
            console.log(e);
        }
    },
    async getBlog(req, res) {
        try {
            const blogPost = await Blog.find({ author: { _id: req.session.userId } });
            res.render('pages/blogmanage', {
                blog: blogPost,
                session: req.session
            });

        } catch (e) {
            console.log(e);
        }
    },
    async blogPage(req, res) {
        try {
            const blogPost = await Blog.find({}).populate('author', 'name');
            res.render('pages/blog', {
                session: req.session,
                blog: blogPost
            });
        } catch (e) {
            console.log(e)
        }
    },
    async editBlogPage(req, res) {
        try {
            // console.log(req.params.id);
            const result = await Blog.findById(req.params.id);
            res.render("pages/editBlog", {
                session: req.session,
                blog: result
            });
        } catch (e) {
            console.log(e);
        }
    },
    async updateBlogPost(req, res) {
        try {
            const result = await Blog.findByIdAndUpdate(req.params.id, req.body);
            if (result) {
                res.redirect('/blogmanagement');
            }
        } catch (e) {
            console.log(e);
        }
    },
    async deleteBlogPost(req, res) {
        try {
            const deletedBlogPost = await Blog.findByIdAndRemove(req.params.id);

        } catch (e) {
            console.log(e);
        }
    },
    async readBlogPost(req, res) {
        try {
            const getBlog = await Blog.findById(req.params.id).populate('author', 'name');
            const getComment = await Comment.find({ blogPost: req.params.id }).populate('user', 'name');
            res.render('pages/blogPost', {
                session: req.session,
                blog: getBlog,
                comment: getComment
            })
        } catch (e) {
            console.log(e);
        }
    },
    async postComment(req, res) {
        try {
            const postComment = new Comment({
                content: req.body.content,
                user: req.session.userId,
                blogPost: req.params.id
            });
            const saveComment = await postComment.save();
            if (saveComment) {
                res.redirect(`/blogPost/${req.params.id}`);
            }
        } catch (e) {
            console.log(e)
        }
    },
    async likePost(req, res) {
        try {
            const liked = await Blog.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } });
        } catch (e) {
            console.log(e);
        }
    },
    async dislikePost(req, res) {
        try {
            const disliked = await Blog.findByIdAndUpdate(req.params.id, { $inc: { likes: -1 } });
        } catch (e) {
            console.log(e);
        }
    },
    async adminLoginPage(req, res) {
        res.render('pages/adminLogin', {
            session: req.session
        });
    },
    async adminLogin(req,res){
        const getCode = await Admin.find({});
        const checkCode = await bcrypt.compare(req.body.code, getCode[0].code);
      
            const getCurrentAdmin = await User.findByIdAndUpdate(req.session.userId,{isAdmin:true});
            res.redirect('/adminManagement');
       
    },
     adminManagementPage(req,res){
        res.render('pages/adminManagement',{
            session:req.session
        });
    }
};












