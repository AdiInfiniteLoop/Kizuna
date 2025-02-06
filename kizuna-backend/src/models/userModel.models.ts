import argon2  from "argon2";
import mongoose from "mongoose";


export interface UserInterface extends Document {
    _id: mongoose.Types.ObjectId;
    email: string,
    fullName: string,
    password: string,
    profilePic ?: string,
    comparePassword(candidatePassword: string) : Promise<boolean>
}

const UserSchema = new mongoose.Schema<UserInterface>({
    email: {
        type: String,
        required: [true, "An email must be present"],
        unique: [true, "A user already exists with this emailId"]
    },
    fullName: {
        type: String,
        required: [true, "A name must be provided"]
    },
    password: {
        type: String,
        minlength: [8, "A password should be of minimum 8 characters"]
    },
    profilePic: {
        type: String,
        default:""
    }
}, {
    timestamps: true
})

UserSchema.pre('save', async function(next) {
    if(!this.isModified) return next();
    try {  
        if(this.password) {
            const hashedPassword = await argon2.hash(this.password)
            this.password = hashedPassword
        }
    }
    catch(err) {
        console.log('An error occured during hashing', err)
    }
    next()
})


UserSchema.methods.comparePassword = async function(candidatePassword: string) {
    return await argon2.verify(this.password, candidatePassword)
}

const User = mongoose.model("User", UserSchema)

export default User