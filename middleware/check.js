function isLoggedin(req, res, next){
    if(req.isAuthenticated()){
        next();
    }else{
        res.redirect("/login");
    }
}

function isGuest(req, res, next){
    if(!req.isAuthenticated()){
        next();
    }else{
        res.redirect("/dash");
    }
}

function isStudent(req, res, next){
    if(req.user.type === 'student'){
        next();
    }else{
        res.redirect('/dash');
    }
}

function isTeacher(req, res, next){
    if(req.user.type === 'teacher'){
        next();
    }else{
        res.redirect('/dash');
    }
}

module.exports = {
    isLoggedin,
    isStudent,
    isTeacher,
    isGuest
}