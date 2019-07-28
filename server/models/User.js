const mongoose = require('mongoose');
const mongodbErrorHandler = require('mongoose-mongodb-errors');
const passportLocalMongoose = require('passport-local-mongoose');
const { ObjectId } = mongoose.Schema;

//Schema
const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: "Email is required"
        },
        fullname: {
            type: String,
            trim: true,
            minlength: 4,
            maxlength: 20
        },
        username: {
            type: String,
            trim: true,
            unique: true,
            minlength: 4,
            maxlength: 15,
            required: "Username is required"
        },
        avatar: {
            type: String,
            required: "Avatar image is required",
            default: "/static/default/images/handsome-pepe.jpg"
        },
        status: {
            type: String,
            default: "Newbie"
        },
        gender: {
            type: String,
            default: "Unknown"
        },
        birthday: {
            type: Date,
        },
        address: {
            type: String,
            default: "Ha Noi"
        },
        link: {
            facebook: {
                type: String
            },
            google: {
                type: String
            }
        },
        following: [{ type: ObjectId, ref: "User" }],
        followers: [{ type: ObjectId, ref: "User" }]
    },
    { timestamps: true }
);

//Auto populate follows data
const autoPopulateFollowingAndFollowers = function (next) {
    this.populate("following", "_id username avatar");
    this.populate("followers", "_id username avatar");
    next();
};
userSchema.pre("findOne", autoPopulateFollowingAndFollowers);

//Passport strategy
userSchema.plugin(passportLocalMongoose, { usernameField: "email" });
userSchema.plugin(mongodbErrorHandler);



module.exports = mongoose.model("User", userSchema);