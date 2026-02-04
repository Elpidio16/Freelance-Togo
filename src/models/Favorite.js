import mongoose from 'mongoose';

const FavoriteSchema = new mongoose.Schema({
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    freelanceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    poolName: {
        type: String,
        default: 'Général',
        trim: true,
    },
    notes: {
        type: String,
        trim: true,
    },
}, {
    timestamps: true,
});

// Unique combination - one favorite per freelance per company
FavoriteSchema.index({ companyId: 1, freelanceId: 1 }, { unique: true });
FavoriteSchema.index({ companyId: 1 });
FavoriteSchema.index({ poolName: 1 });

export default mongoose.models.Favorite || mongoose.model('Favorite', FavoriteSchema);
