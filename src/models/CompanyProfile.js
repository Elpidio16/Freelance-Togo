import mongoose from 'mongoose';

const CompanyProfileSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true,
    },
    companyName: {
        type: String,
        required: true,
    },
    sector: {
        type: String,
        required: true,
    },
    size: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '200+'],
        required: true,
    },
    website: {
        type: String,
    },
    description: {
        type: String,
        maxlength: 1000,
    },
    logo: {
        type: String,
        default: null,
    },
    location: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.CompanyProfile ||
    mongoose.model('CompanyProfile', CompanyProfileSchema);
