import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { ReviewsService, ReviewWithUser } from "@/services/reviewsService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, StarOff, Send, Edit, Trash2 } from "lucide-react";

interface ReviewFormProps {
  storyId: string;
  onReviewSubmitted: () => void;
}

export default function ReviewForm({ storyId, onReviewSubmitted }: ReviewFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState<ReviewWithUser | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserReview();
    }
  }, [user, storyId]);

  const loadUserReview = async () => {
    try {
      const reviews = await ReviewsService.getReviewsForStory(storyId);
      const userReview = reviews.find(review => review.user_id === user?.id);
      if (userReview) {
        setExistingReview(userReview);
        setRating(userReview.rating);
        setComment(userReview.comment || "");
      }
    } catch (error) {
      console.error("Error loading user review:", error);
    }
  };

  const handleStarClick = (starRating: number) => {
    setRating(starRating);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to submit a review.",
        variant: "destructive",
      });
      return;
    }

    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await ReviewsService.upsertReview({
        user_id: user.id,
        story_id: storyId,
        rating,
        comment: comment.trim() || null,
      });

      toast({
        title: existingReview ? "Review Updated" : "Review Submitted",
        description: existingReview 
          ? "Your review has been updated successfully."
          : "Thank you for your review!",
      });

      setExistingReview({
        id: "",
        user_id: user.id,
        story_id: storyId,
        rating,
        comment: comment.trim() || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        profiles: null,
      });
      
      setIsEditing(false);
      onReviewSubmitted();
    } catch (error) {
      console.error("Error submitting review:", error);
      toast({
        title: "Error",
        description: "Failed to submit review. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!user || !existingReview) return;

    try {
      await ReviewsService.deleteReview(storyId, user.id);
      setExistingReview(null);
      setRating(0);
      setComment("");
      setIsEditing(false);
      
      toast({
        title: "Review Deleted",
        description: "Your review has been deleted successfully.",
      });
      
      onReviewSubmitted();
    } catch (error) {
      console.error("Error deleting review:", error);
      toast({
        title: "Error",
        description: "Failed to delete review. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!user) {
    return (
      <Card className="bg-gray-800/50 border-gray-700">
        <CardContent className="p-6">
          <p className="text-gray-300 text-center">
            Please log in to leave a review.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          {existingReview && !isEditing ? (
            <>
              <Edit className="h-5 w-5" />
              Your Review
            </>
          ) : (
            <>
              <Send className="h-5 w-5" />
              {existingReview ? "Edit Review" : "Write a Review"}
            </>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {existingReview && !isEditing ? (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-5 w-5 ${
                    star <= existingReview.rating
                      ? "text-yellow-400 fill-current"
                      : "text-gray-400"
                  }`}
                />
              ))}
              <span className="text-white ml-2">{existingReview.rating}/5</span>
            </div>
            {existingReview.comment && (
              <p className="text-gray-300">{existingReview.comment}</p>
            )}
            <div className="flex gap-2">
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                onClick={handleDelete}
                variant="outline"
                size="sm"
                className="border-red-600 text-red-400 hover:bg-red-900/20"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Rating *
              </label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleStarClick(star)}
                    className="focus:outline-none focus:ring-2 focus:ring-cyan-400 rounded"
                  >
                    {star <= rating ? (
                      <Star className="h-6 w-6 text-yellow-400 fill-current hover:text-yellow-300" />
                    ) : (
                      <StarOff className="h-6 w-6 text-gray-400 hover:text-yellow-300" />
                    )}
                  </button>
                ))}
                <span className="text-white ml-2">{rating}/5</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Comment (Optional)
              </label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your thoughts about this story..."
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
                rows={4}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-1">
                {comment.length}/500 characters
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={isSubmitting || rating === 0}
                className="bg-cyan-600 hover:bg-cyan-700 text-white"
              >
                {isSubmitting ? (
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                ) : (
                  <Send className="h-4 w-4 mr-2" />
                )}
                {existingReview ? "Update Review" : "Submit Review"}
              </Button>
              {existingReview && (
                <Button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setRating(existingReview.rating);
                    setComment(existingReview.comment || "");
                  }}
                  variant="outline"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
} 