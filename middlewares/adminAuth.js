function adminAuth(req, res, next){
    if(req.session.user != undefined){
        //esta logado, sessao user existe
        next();
    }else{
        res.redirect("/login");
    }
}

module.exports = adminAuth