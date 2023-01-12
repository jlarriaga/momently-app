const router = require("express").Router()
const User = require("../models/User.model")
const Event = require("../models/Event.model")
const Guest = require("../models/Guest.model")
const isLoggedIn = require("../middleware/isLoggedIn")

router.get("/create", (req,res,next)=>{
    res.render("user/addGuests")
})

router.post("/create", async (req,res,next) => {
    const { name, email} = req.body
    try{
        const guestCreted = await Guest.create( { name, email} )
        res.redirect("user/addGuests")
    } catch (error){
        res.render("addGuests")
    }   
})

module.exports = router;