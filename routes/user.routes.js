const router = require("express").Router()
const User = require("../models/User.model")
const Event = require("../models/Event.model")
const Guest = require("../models/Guest.model")
const isLoggedIn = require("../middleware/isLoggedIn")


router.get("/home", isLoggedIn, (req,res,next)=>{
    console.log("req.session:", req.session);
        const user = req.session.currentUser
        res.render("user/myEvents") 
})

router.get("/create", isLoggedIn, (req,res,next)=>{
    res.render("user/newEvent")
})

router.post("/create", isLoggedIn, async (req,res,next) => {
    const user = req.session.currentUser
    const { title, location, description, date} = req.body
    try{
        const eventCreated = await Event.create( { title, location, description, date, _owner: user._id } )
        res.redirect(`create/${eventCreated._id}/addGuests`)
        
    } catch (error){
        res.render("user/newEvent")
    }   
}) 

router.get("/create/:id/addGuests", isLoggedIn, async (req,res,next) =>{
    const { id } = req.params
    try{
        const event = await Event.findById(id)
        const guestList = await Guest.find()

        res.render("user/addGuests", { event, guestList })
    } catch (error){
        res.render("user/newEvent")
        //pagina error
    }
})

router.post("/create/:id/addGuests", isLoggedIn, async (req,res,next) =>{
    const { id } = req.params
    const { name, email } = req.body
    try {
        const guestCreated = await Guest.create({name, email, id})
        res.render("user/addGuests", {guestCreated})
    } catch (error) {
        res.render("user/newEvent")
    }
    res.redirect("user/addGuests")
} )



//get y vacio, redirect a login

router.get("/myEvents", isLoggedIn, async (req,res,next) => {
    const user = req.session.currentUser
    try {
        const eventFound = await Event.find()
        res.render("user/myEvents")
    } catch (error) {
        next(error);
    }
})

//

module.exports = router;