// Script temporaire pour activer manuellement un compte
// À exécuter avec: node scripts/activate-account.js email@example.com

const mongoose = require('mongoose');

// Connexion MongoDB
const MONGODB_URI = 'mongodb://localhost:27017/freelance-togo';

const UserSchema = new mongoose.Schema({
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    role: String,
    phone: String,
    city: String,
    isVerified: Boolean,
    emailVerified: Date,
    createdAt: Date,
});

const User = mongoose.model('User', UserSchema);

async function activateAccount(email) {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connecté à MongoDB');

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            console.error('❌ Utilisateur non trouvé:', email);
            process.exit(1);
        }

        if (user.isVerified) {
            console.log('✅ Ce compte est déjà vérifié !');
            process.exit(0);
        }

        user.isVerified = true;
        user.emailVerified = new Date();
        await user.save();

        console.log('✅ Compte activé avec succès !');
        console.log('Nom:', user.firstName, user.lastName);
        console.log('Email:', user.email);
        console.log('Vous pouvez maintenant vous connecter !');

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Erreur:', error.message);
        process.exit(1);
    }
}

const email = process.argv[2];

if (!email) {
    console.error('Usage: node scripts/activate-account.js email@example.com');
    process.exit(1);
}

activateAccount(email);
