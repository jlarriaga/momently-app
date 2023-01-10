module.exports = (roles) => {

    return (req,res,next) =>{
        const {role} = req.session.currentUser

        if(roles.includes(role)){
            next()
        } else {
        return res.redirect("/")
        }
    }
}