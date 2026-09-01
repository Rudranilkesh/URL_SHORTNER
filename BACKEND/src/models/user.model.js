import mongoose from "mongoose";
import crypto from "crypto";
import bcrypt from "bcrypt";

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
}, { 
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password;
            return ret;
        }
    }
});

userSchema.pre("save", async function () {
    if (this.isModified("email") || !this.avatar) {
        const hash = crypto.createHash("md5").update(this.email.trim().toLowerCase()).digest("hex");
        this.avatar = `https://www.gravatar.com/avatar/${hash}?d=identicon`;
    }
});

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);


