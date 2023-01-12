const { Schema, model } = require("mongoose");

const eventSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    date:{
      type: Date,
      required: true
    },
    photos:{
        type:[String],
        required: false,
        default:"https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.luftechnik.com%2Fplaceholder-png%2F&psig=AOvVaw2GdSgbaRrkI8uROpt-NW9_&ust=1673402231494000&source=images&cd=vfe&ved=0CBAQjRxqFwoTCKjBy6Lzu_wCFQAAAAAdAAAAABAD",
    },
    _owner:{
        type: Schema.Types.ObjectId,
        ref:"User",
    }
    // Event.findOneAndupdate({_owner:req.session.currentUser._id, _id:req.params.id })
  },
  {
    timestamps: true,
  }
);

const Event = model("Event", eventSchema);

module.exports = Event;