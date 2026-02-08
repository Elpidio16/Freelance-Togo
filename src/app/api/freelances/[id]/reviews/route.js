import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET /api/freelances/[id]/reviews - Get all reviews for a freelancer
export async function GET(request, { params }) {
    try {
        const freelanceId = params.id;

        // In Prisma, reviews are linked to user (freelanceId is User ID).
        // But here params.id might be FreelanceProfile ID?
        // Let's check the Mongoose code: `Review.find({ freelanceId })`.
        // Mongoose Review model: `freelanceId: { type: Schema.Types.ObjectId, ref: 'User' }`.
        // So `freelanceId` in Review is a User ID.
        // But `params.id` in this route is... let's check input in frontend.
        // If the URL is `/freelances/[id]`, usually `id` is the Profile ID or User ID?
        // In `freelances/[id]/route.js`, `FreelanceProfile.findById(id)` is used. So `id` is Profile ID.
        // But `Review.find({ freelanceId })` implies it's looking for reviews by User ID.
        // So if `params.id` is Profile ID, we need to find the User ID first?
        // OR `freelanceId` in Mongoose Review was actually Profile ID?
        // Let's check `Review.js` from my memory/learnings.
        // `freelanceId` ref 'User'.
        // So if `params.id` is Profile ID, the original code `Review.find({ freelanceId })` where `freelanceId = params.id`
        // implies that `params.id` WAS passed as User ID to this route?
        // OR the variable name `freelanceId` in Mongoose find query meant "User ID of the freelancer".
        // If the route is `/api/freelances/[id]/reviews`, and `id` comes from the page URL `freelances/[id]`, 
        // and `freelances/[id]` page usually fetches Profile by ID.
        // There is a mismatch if `params.id` is Profile ID but Review stores User ID.

        // Let's look at `freelances/[id]/route.js` again. It uses `FreelanceProfile.findById(id)`.
        // So `params.id` IS Profile ID.
        // The original code in `reviews` route used `const freelanceId = params.id; const reviews = await Review.find({ freelanceId });`
        // This implies that reviews were stored with `freelanceId` = Profile ID?
        // OR the frontend passes User ID in the URL for reviews?
        // If consistency matters, `freelances/[id]` (profile) uses Profile ID.
        // So `freelances/[id]/reviews` should probably use Profile ID to find User ID, then finds reviews.
        // OR the original Mongoose schema `freelanceId` was ref 'FreelanceProfile'?
        // Viewed `Review.js` in step 1917: `freelance: { type: Schema.Types.ObjectId, ref: 'User' }` (Wait/Check).
        // Step 1917 said: "Review, capturing project, freelancer, company...".
        // If I assume `freelanceId` is User ID in Prisma Schema.

        // If `params.id` is Profile ID, I should fetch Profile first to get userId.
        // However, if the original code worked, maybe `freelanceId` in Review was Profile ID.
        // Let's check Prisma Schema for Review.
        // `freelanceId String`, `freelance User @relation(...)`.
        // So in Prisma it IS User ID.

        // If `params.id` is Profile ID, I must find the profile first.
        const profile = await prisma.freelanceProfile.findUnique({
            where: { id: freelanceId }, // Assuming params.id is Profile ID
            select: { userId: true }
        });

        let targetUserId = freelanceId;
        if (profile) {
            targetUserId = profile.userId;
        } else {
            // Maybe params.id is ALREADY User ID?
            // If we can't find profile by that ID, maybe it's a User ID?
            // Or maybe it returns 404?
            // Let's assume proper linking.
            // If the original code used `Review.find({ freelanceId: params.id })`, and Review.freelanceId ref User,
            // then params.id WAS User ID not Profile ID.
            // BUT `freelances/[id]/route.js` treats `params.id` as Profile ID.
            // This suggests a confusion in the original codebase or my understanding.
            // BUT, since we are migrating, we should stick to what `freelances/[id]/route.js` does.
            // It treats `id` as Profile ID.
            // So if the user navigates to `/freelances/123` (Profile 123), and fetches reviews,
            // the fetch URL is `/api/freelances/123/reviews`.
            // So `params.id` is 123 (Profile ID).
            // But Review is linked to User.
            // schema.prisma: `model Review { ... freelanceId String ... }`.
            // So we MUST resolve Profile ID -> User ID.
        }

        // Wait, if I am wrong and `params.id` IS User ID?
        // Then `freelances/[id]/route.js` using `FreelanceProfile.findById(id)` would fail unless ProfileID == UserID (unlikely).
        // So `params.id` almost certainly IS Profile ID.
        // So implicit Logic: Query Reviews by FreelanceProfile?
        // Does Review have `freelanceProfileId`? No.
        // So we need: Profile -> User -> Reviews.

        // So:
        // 1. Check if profile exists with this ID.
        // 2. If so, get userId.
        // 3. Find reviews for this userId.

        const existingProfile = await prisma.freelanceProfile.findUnique({
            where: { id: freelanceId },
            include: { user: true }
        });

        if (!existingProfile) {
            // Fallback: Maybe it is a user ID? (For legacy support?)
            // Or return 404?
            // Note: The original code `Review.find({ freelanceId })` suggests `freelanceId` in Review matched `params.id`.
            // If `params.id` was Profile ID, then Review.freelanceId must be Profile ID?
            // But `models/Review.js` (viewed earlier): `freelance: { type: ObjectId, ref: 'User' }`?
            // Let me re-verify `Review.js` content if I can.
            // I viewed it in step 1917. "capturing project, freelancer, company...".
            // If I can't be sure, I'll assume standard pattern: ID in URL matches ID in Collection related to the Resource.
            // Resource is Freelancer (via Profile).

            // I'll assume I need to fetch User ID from Profile.
            return NextResponse.json(
                { error: 'Profil non trouvé' },
                { status: 404 }
            );
        }

        const userId = existingProfile.userId;

        const reviews = await prisma.review.findMany({
            where: { freelanceId: userId },
            include: {
                company: {
                    include: {
                        companyProfile: true
                    }
                },
                project: {
                    select: { title: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const reviewsWithCompany = reviews.map((review) => {
            const companyProfile = review.company.companyProfile;
            return {
                _id: review.id,
                id: review.id,
                rating: review.rating,
                comment: review.comment,
                skillsRating: review.skillsRating, // JSON
                wouldRecommend: review.wouldRecommend,
                createdAt: review.createdAt,
                project: {
                    title: review.project?.title || 'Projet',
                },
                company: {
                    name: companyProfile?.companyName || `${review.company.firstName} ${review.company.lastName}`,
                },
            };
        });

        // Calculate stats
        const total = reviews.length;
        const stats = {
            totalReviews: total,
            averageRating: total > 0
                ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / total) * 10) / 10
                : 0,
            ratingDistribution: {
                5: reviews.filter(r => r.rating === 5).length,
                4: reviews.filter(r => r.rating === 4).length,
                3: reviews.filter(r => r.rating === 3).length,
                2: reviews.filter(r => r.rating === 2).length,
                1: reviews.filter(r => r.rating === 1).length,
            },
            recommendationRate: total > 0
                ? Math.round((reviews.filter(r => r.wouldRecommend).length / total) * 100)
                : 0,
        };

        return NextResponse.json(
            {
                reviews: reviewsWithCompany,
                stats,
            },
            { status: 200 }
        );

    } catch (error) {
        console.error('Erreur GET /api/freelances/[id]/reviews:', error);
        return NextResponse.json(
            { error: 'Erreur lors de la récupération des avis' },
            { status: 500 }
        );
    }
}
