module.exports = (req, res, next) => {
    if (req.session && req.session.isAdmin === true) {
        return next();
    } else {
       return res.redirect('/admin'); 
    }

}