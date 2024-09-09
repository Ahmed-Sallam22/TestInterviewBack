import mongoose, { Schema, model } from "mongoose";


const userSchema = new Schema({



    userName:{
        type: String,
        required: [true, 'UserName is required'],
        trim: true,
        unique: true, 
        lowercase:true,
        minlength: [3, 'UserName must be at least 3 characters long']
    },

    pass: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters long'], 
        select: false 
    },
    
    role: {
        type: String,
        enum: ['client', 'admin'],
        required: true
    },

    token: { 
        type: String
    }

}, {
    timestamps: true
})

const userModel =mongoose.models.User|| model('User', userSchema)
export default userModel