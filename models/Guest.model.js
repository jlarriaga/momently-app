const { Schema, model } = require("mongoose");

const guestSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
    },
    _event: {
        type: Schema.Types.ObjectId,
        ref:"Event",
        required: true
    },
    isConfirmed: {
      type: Boolean,
      required: true,
      default:false
    },
    _user:{
        type: Schema.Types.ObjectId,
        ref:"User"
    }
  },
  {
    timestamps: true,
  }
);

const Guest = model("Guest", guestSchema);

module.exports = Guest;