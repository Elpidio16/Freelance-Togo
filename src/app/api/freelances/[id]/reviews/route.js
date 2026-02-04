import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import User from '@/models/User';
import CompanyProfile from '@/models/CompanyProfile';

// GET /api/freelances/[id]/reviews - Get all reviews for a freelancer
export async function GET(request, { params }) {
    try {
        await connectDB();

        const freelanceId = params.id;

        const reviews = await Review.find({ freelanceId })
            .populate('companyId', 'firstName lastName')
            .populate('projectId', 'title')
            .sort({ createdAt: -1 });

        const reviewsWithCompany = await Promise.all(
            reviews.map(async (review) => {
                const companyProfile = await CompanyProfile.findOne({
                    userId: review.companyId._id,
                });

                return {
                    _id: review._id,
                    rating: review.rating,
                    comment: review.comment,
                    skillsRating: review.skillsRating,
                    wouldRecommend: review.wouldRecommend,
                    createdAt: review.createdAt,
                    project: {
                        title: review.projectId?.title || 'Projet',
                    },
                    company: {
                        name: companyProfile?.companyName || `${review.companyId.firstName} ${review.companyId.lastName}`,
                    },
                };
            })
        );

        // Calculate stats
        const stats = {
            totalReviews: reviews.length,
            averageRating: reviews.length > 0
                ? Math.round((reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) * 10) / 10
                : 0,
            ratingDistribution: {
                5: reviews.filter(r => r.rating === 5).length,
                4: reviews.filter(r => r.rating === 4).length,
                3: reviews.filter(r => r.rating === 3).length,
                2: reviews.filter(r => r.rating === 2).length,
                1: reviews.filter(r => r.rating === 1).length,
            },
            recommendationRate: reviews.length > 0
                ? Math.round((reviews.filter(r => r.wouldRecommend).length / reviews.length) * 100)
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
