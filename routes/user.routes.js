const router = require("express").Router()
const User = require("../models/User.model")
const isLoggedIn = require("../middleware/isLoggedIn")
const checkRole = require("../middleware/checkRole")

router.get("/home", isLoggedIn, (req,res,next)=>{
    console.log("req.session:", req.session);

    //Validar navbar, mandamos datos de usuarios
    const user = req.session.currentUser
    res.render("user/home")
})

//admin
router.get("/admin", isLoggedIn, checkRole(["Admin"]), async (req,res,next) =>{
    try {                       //trae todo lo que no sean suaurios Lo despar4eces como en mongoose
        const user = req.session.currentUser
        const users = await User.find({$nor: [{role:"Admin"}] }, {password:0})
        res.render("user/edit", {users})
    } catch (error) {
        next(error)
    }
})

module.exports = router;