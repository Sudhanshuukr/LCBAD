import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Story } from "../data/stories";
import { ReviewsService, ReviewStats } from "../services/reviewsService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Star, BookOpen, Calendar, User } from "lucide-react";

interface StoryCardWithReviewsProps {
  story: Story;
}

export default function StoryCardWithReviews({ story }: StoryCardWithReviewsProps) {
  const [reviewStats, setReviewStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviewStats();
  }, [story.id]);

  const loadReviewStats = async () => {
    try {
      setLoading(true);
      const stats = await ReviewsService.getReviewStats(story.id);
      setReviewStats(stats);
    } catch (error) {
      console.error("Error loading review stats:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Link to={`/read/${story.id}`} className="block">
      <Card className="glass-card h-full card-hover border-purple-500/30 hover:border-cyan-400/50 transition-all duration-300 group">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-cyan-400 mr-2" />
              <CardTitle className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                {story.title}
              </CardTitle>
            </div>
            {story.featured && (
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                FEATURED
              </div>
            )}
          </div>
          
          <div className="flex items-center text-sm text-gray-400 mb-2">
            <User className="h-4 w-4 mr-1" />
            <span>{story.author}</span>
            <span className="mx-2">•</span>
            <Calendar className="h-4 w-4 mr-1" />
            <span>{story.published}</span>
          </div>

          {/* Review Stats */}
          {!loading && reviewStats && reviewStats.totalReviews > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-3 w-3 ${
                      star <= Math.round(reviewStats.averageRating)
                        ? "text-yellow-400 fill-current"
                        : "text-gray-400"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">
                {reviewStats.averageRating.toFixed(1)} ({reviewStats.totalReviews} reviews)
              </span>
            </div>
          )}
        </CardHeader>
        
        <CardContent>
          <p className="text-gray-300 leading-relaxed line-clamp-3">
            {story.summary}
          </p>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-cyan-400 group-hover:text-yellow-400 transition-colors">
              <BookOpen className="h-4 w-4 mr-1" />
              <span className="text-sm font-medium">Read Story</span>
            </div>
            
            {loading ? (
              <div className="animate-pulse h-4 w-16 bg-gray-700 rounded"></div>
            ) : reviewStats && reviewStats.totalReviews > 0 ? (
              <div className="text-xs text-gray-400">
                {reviewStats.totalReviews} review{reviewStats.totalReviews !== 1 ? 's' : ''}
              </div>
            ) : (
              <div className="text-xs text-gray-500">No reviews yet</div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
} 