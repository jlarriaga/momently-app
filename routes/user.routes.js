const router = require("express").Router()
const User = require("../models/User.model")
const Event = require("../models/Event.model")
const Guest = require("../models/Guest.model")
const isLoggedIn = require("../middleware/isLoggedIn")
const moment = require("moment")

//home
router.get("/home", isLoggedIn, async (req,res,next)=>{
    const user = req.session.currentUser
    try{
    const eventList = await Event.find({_owner: user._id})
    res.render("user/myEvents", {eventList})  
    } catch (error) {
        next(error)
    }
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

//Edit Event
router.get("/create/:idEvent/edit", isLoggedIn, async (req,res,next)=>{
    const {idEvent} = req.params
    
    try {
        const eventEdit = await Event.findById(idEvent)
        let newEdit = eventEdit.toObject()
        newEdit.date = moment(eventEdit.date).subtract(1, 'days').calendar();
        res.render("user/editEvent", {eventEdit: newEdit})
    } catch (error) {
        next(error)
    }
})

router.post("/create/:idEvent/edit", isLoggedIn, async(req,res,next) =>{
    const {idEvent} = req.params
    const user = req.session.currentUser
    const { title, location, description, date} = req.body
    try {
    const newEventEdit = await Event.findByIdAndUpdate(idEvent,{...req.body},{new:true})
    console.log("new", newEventEdit);
    res.redirect(`create/${newEventEdit._id}/addGuests`)        
    } catch (error) {
        next(error)
    }

})





//GET Add Guest con id del Event
router.get("/create/:id/addGuests", isLoggedIn, async (req,res,next) =>{
    const { id } = req.params
    try{
        const event = await Event.findById(id)
        const guestList = await Guest.find({_event:id})

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

//POST Edit Guest
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

//Event Details
router.get("/create/:idEvent/eventDetails", isLoggedIn, async (req,res,next) =>{
    const { idEvent } = req.params
    try{
        const event = await Event.findById(idEvent)
        const guestList = await Guest.find({_event:idEvent})

        res.render("user/eventDetails", { event, guestList })
    } catch {
        next (error)
    }
})



//get y vacio, redirect a login

/**router.get("/home", isLoggedIn, async (req,res,next) => {
    const user = req.session.currentUser
    try {
        const myEvents = await Event.findById({_owner: user._id})
        res.render("user/myEvents", {myEvents})
    } catch (error) {
        next(error);
    }
})*/



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