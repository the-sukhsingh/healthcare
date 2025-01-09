import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const HospitalSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a name"],
    },
    location: {
      address: {
        type: String,
        required: [true, "Please provide an address"],
      },
      city: {
        type: String,
        required: [true, "Please provide a city"],
      },
      state: {
        type: String,
        required: [true, "Please provide a state"],
      },
      zipCode: {
        type: String,
        required: [true, "Please provide a zip code"],
      },
    },
    contact: {
      phone: {
        type: String,
        required: [true, "Please provide a phone number"],
      },
      email: {
        type: String,
        required: [true, "Please provide an email"],
      },
    },
    website: {
      type: String,
    },
    services: {
      type: [String],
    },
    doctors: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
      },
    ],
    bedAvailability: {
      total: {
        type: Number,
        required: [true, "Please provide total number of beds"],
      },
      available: {
        type: Number,
        required: [true, "Please provide available number of beds"],
      },
    },
    identifier: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      select: false,
    },
  },
  { timestamps: true }
);

HospitalSchema.pre("save", async function (next) {
  this.identifier = this.name.replace(/\s/g, "-").toLowerCase();
  if (!this.isModified("password")) {
    next();
  }

  this.password = await bcrypt.hash(this.password, 10);
  next();
});

HospitalSchema.methods.comparePassword = async function (password) {
  if (!this.password) {
    const Hospital = await this.constructor
      .findById(this._id)
      .select("+password");
    return await bcrypt.compare(password, Hospital.password);
  }
  return await bcrypt.compare(password, this.password);
};

HospitalSchema.methods.generateToken = function () {
  return jwt.sign({ id: this._id,email:this.contact.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

const Hospital = mongoose.models.Hospital || mongoose.model("Hospital", HospitalSchema);

export default Hospital;
