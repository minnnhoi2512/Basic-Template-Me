import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      auto: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6, 
      trim: true, 
      validate: {
        validator: (value: string) => value.length >= 6, 
        message: "Password must be at least 6 characters long",
      },
    },
    status :{
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    }
  },
  { timestamps: true } // Correct placement of the timestamps option
);

// Create an index on the email field
// UserSchema.index({ email: 1 }, { unique: true });

export default mongoose.model("User", UserSchema);
