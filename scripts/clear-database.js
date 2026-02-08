// Script pour supprimer tous les comptes de la base de données
// ATTENTION : Cette opération est IRRÉVERSIBLE !

import mongoose from 'mongoose';

// Modèles simplifiés
const UserSchema = new mongoose.Schema({}, { strict: false });
const FreelanceProfileSchema = new mongoose.Schema({}, { strict: false });
const VerificationTokenSchema = new mongoose.Schema({}, { strict: false });

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const FreelanceProfile = mongoose.models.FreelanceProfile || mongoose.model('FreelanceProfile', FreelanceProfileSchema);
const VerificationToken = mongoose.models.VerificationToken || mongoose.model('VerificationToken', VerificationTokenSchema);

async function clearDatabase() {
    try {
        // Lire MONGODB_URI depuis les arguments ou utiliser une valeur par défaut
        const mongoUri = process.env.MONGODB_URI;

        if (!mongoUri) {
            console.error('❌ MONGODB_URI non défini');
            console.log('Usage: MONGODB_URI="votre_uri" node scripts/clear-database.js');
            process.exit(1);
        }

        console.log('🔌 Connexion à MongoDB...');
        await mongoose.connect(mongoUri);

        console.log('⚠️  ATTENTION : Suppression de TOUS les comptes en cours...');

        // Supprimer tous les profils freelances
        const profilesDeleted = await FreelanceProfile.deleteMany({});
        console.log(`✅ ${profilesDeleted.deletedCount} profils freelances supprimés`);

        // Supprimer tous les tokens de vérification
        const tokensDeleted = await VerificationToken.deleteMany({});
        console.log(`✅ ${tokensDeleted.deletedCount} tokens de vérification supprimés`);

        // Supprimer tous les utilisateurs
        const usersDeleted = await User.deleteMany({});
        console.log(`✅ ${usersDeleted.deletedCount} utilisateurs supprimés`);

        console.log('\n✨ Base de données nettoyée avec succès !');
        console.log('Vous pouvez maintenant créer de nouveaux comptes avec le champ catégorie.');

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la suppression :', error);
        process.exit(1);
    }
}

clearDatabase();
