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
}, { timestamps: true });

userSchema.set('toJSON', {
    transform: function (doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
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
    // Fallback for legacy user records created before bcrypt hashing was added
    if (!this.password.startsWith("$2a$") && !this.password.startsWith("$2b$") && !this.password.startsWith("$2y$")) {
        if (password === this.password) {
            this.password = password;
            await this.save();
            return true;
        }
        return false;
    }
    return await bcrypt.compare(password, this.password);
};

export default mongoose.model("User", userSchema);


