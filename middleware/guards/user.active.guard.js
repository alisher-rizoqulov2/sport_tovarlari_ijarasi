module.exports = function (req, res, next) {
    console.log(req.user.is_active);
    if(!req.user.is_active){
        return res.status(403).send({message:"Active False Yani Activ Mas"})
    }
    next()
}