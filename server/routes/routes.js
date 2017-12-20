const blogController = require('../controller/blogController');
const authenticate = require('../middleware/auth');
const adminAuthenticate = require('../middleware/adminMiddleware');
module.exports = (app) => {
    //routes render Page
    app.get('/', blogController.homePage);
    app.get('/login', blogController.loginPage);
    app.get('/signup', blogController.signupPage);
    app.get('/user', authenticate, blogController.userPage);
    app.get('/blog',blogController.blogPage);
    app.get('/editBlog/:id',authenticate,blogController.editBlogPage);
    app.get('/admin',authenticate,blogController.adminLoginPage);
    app.get('/adminManagement',adminAuthenticate,blogController.adminManagementPage);

    //routes http server
    app.post('/signup', blogController.signupUser);
    app.post('/login', blogController.loginUser);
    app.get('/logout',authenticate, blogController.logout);
    app.post('/changepass',authenticate,blogController.changeUserPass);
    app.post('/update',authenticate,blogController.updateUserInfo);
    app.delete('/deleteuser',authenticate,blogController.deleteUser);
    app.post('/createblog',authenticate,blogController.createBlog);
    app.get('/blogmanagement',authenticate,blogController.getBlog);
    app.post('/editBlog/:id',authenticate,blogController.updateBlogPost);
    app.delete('/deleteBlog/:id',authenticate,blogController.deleteBlogPost);
    app.get('/blogPost/:id',blogController.readBlogPost);
    app.post('/comment/:id',authenticate,blogController.postComment);
    app.post('/likepost/:id',authenticate,blogController.likePost);
    app.post('/dislike/:id',authenticate,blogController.dislikePost);
    app.post('/adminLogin',authenticate,blogController.adminLogin);
}