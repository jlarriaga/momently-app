const router = require("express").Router()
const User = require("../models/User.model")
const Event = require("../models/Event.model")
const Guest = require("../models/Guest.model")
const isLoggedIn = require("../middleware/isLoggedIn")
const { response } = require("express")

//home
router.get("/home", isLoggedIn, (req,res,next)=>{
    console.log("req.session:", req.session);
        const user = req.session.currentUser
        res.render("user/myEvents") 
})

//GET Create Event
router.get("/create", isLoggedIn, (req,res,next)=>{
    res.render("user/newEvent")
})

//POST Create Event
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

//GET Add Guest con id del Event
router.get("/create/:id/addGuests", isLoggedIn, async (req,res,next) =>{
    const { id } = req.params
    try{
        const event = await Event.findById(id)
        const guestList = await Guest.find({_event:id})
        console.log("Lista de invitados", guestList)

        res.render("user/addGuests", { event, guestList })
    } catch (error){
        console.log(error);
        res.render("user/newEvent")
        //pagina error
    }
})

router.post("/create/:id/addGuests", isLoggedIn, async (req,res,next) =>{
    const { id } = req.params
    const { name, email } = req.body
    const user = req.session.currentUser

    try {
        const guestCreated = await Guest.create({name, email, _event:id})
        res.redirect(`/user/create/${id}/addGuests`)
    } catch (error) {
        res.render("user/newEvent")
    }
})

//GET Edit
router.post("/create/:idEvent/edit/:idGuest",isLoggedIn, async(req,res,next)=>{
    const { idEvent, idGuest } = req.params
    const user = req.session.currentUser

    try {
        const guestEdit = await Guest.findByIdAndUpdate(idGuest,{...req.body},{new:true})
        res.redirect(`/user/create/${idEvent}/addGuests`)
    } catch (error) {
        next(error)
    }

})



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

//GET Delete
router.get("/guest/:idEvent/delete/:idGuest",async (req,res,next)=>{
    const { idEvent, idGuest } = req.params;
    try {
         await Guest.findByIdAndRemove(idGuest)
         res.redirect(`/user/create/${idEvent}/addGuests`)
        
    } catch (error) {
        next(error)
        
    }

})

//

module.exports = router;