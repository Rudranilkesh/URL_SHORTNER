import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false
    }, 

    avatar:{
        type: String,
        required: false,
    }
}, { timestamps: true });

userSchema.pre("save", async function () {
    if (this.isModified("email") || !this.avatar) {
        const hash = crypto.createHash("md5").update(this.email.trim().toLowerCase()).digest("hex");
        this.avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    return candidatePassword === this.password;
};

export default mongoose.model("User", userSchema);

