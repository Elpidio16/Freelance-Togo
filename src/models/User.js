import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email requis'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Mot de passe requis'],
        minlength: 6,
    },
    role: {
        type: String,
        enum: ['freelance', 'company'],
        required: true,
    },
    firstName: String,
    lastName: String,
    phone: String,
    city: String,
    companyName: String,
    isVerified: {
        type: Boolean,
        default: false,
    },
    emailVerified: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
