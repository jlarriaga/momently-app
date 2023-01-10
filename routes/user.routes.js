const router = require("express").Router()
const User = require("../models/User.model")
const Event = require("../models/Event.model")
const Guest = require("../models/Guest.model")
const isLoggedIn = require("../middleware/isLoggedIn")

router.get("/home", isLoggedIn, (req,res,next)=>{
    console.log("req.session:", req.session);

    //Validar navbar, mandamos datos de usuarios
    const user = req.session.currentUser
    res.render("user/myEvents")
})

router.get("/create", (req,res,next)=>{
    res.render("user/newEvent")
})

router.post("/create", (req,res,next) => {
    const { title, location, description, date, photos ,guests } = req.body
    Event.create( { title, location, description, date, photos, guests } )
   .then (events => {
    res.redirect("user/myEvents")
   })        
   .catch (error => res.render("user/newEvent"))
    })

router.get("/myEvents", (req,res,next) => {
    Event.find()
    .then(events =>{
        res.render("user/myEvents", { events })
    })
    .catch(error => next(error))
})

//

module.exports = router;