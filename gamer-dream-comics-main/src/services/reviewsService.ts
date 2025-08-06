import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type Review = Database["public"]["Tables"]["reviews"]["Row"];
type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];
type ReviewUpdate = Database["public"]["Tables"]["reviews"]["Update"];

export interface ReviewWithUser extends Review {
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    [key: number]: number;
  };
}

export class ReviewsService {
  // Get all reviews for a story
  static async getReviewsForStory(storyId: string): Promise<ReviewWithUser[]> {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        profiles:user_id (
          full_name,
          avatar_url
        )
      `)
      .eq("story_id", storyId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching reviews:", error);
      throw error;
    }

    return data || [];
  }

  // Get user's review for a story
  static async getUserReview(storyId: string, userId: string): Promise<Review | null> {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("story_id", storyId)
      .eq("user_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching user review:", error);
      throw error;
    }

    return data;
  }

  // Create or update a review
  static async upsertReview(review: ReviewInsert): Promise<Review> {
    const { data, error } = await supabase
      .from("reviews")
      .upsert(review, {
        onConflict: "user_id,story_id"
      })
      .select()
      .single();

    if (error) {
      console.error("Error upserting review:", error);
      throw error;
    }

    return data;
  }

  // Delete a review
  static async deleteReview(storyId: string, userId: string): Promise<void> {
    const { error } = await supabase
      .from("reviews")
      .delete()
      .eq("story_id", storyId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error deleting review:", error);
      throw error;
    }
  }

  // Get review statistics for a story
  static async getReviewStats(storyId: string): Promise<ReviewStats> {
    const { data, error } = await supabase
      .from("reviews")
      .select("rating")
      .eq("story_id", storyId);

    if (error) {
      console.error("Error fetching review stats:", error);
      throw error;
    }

    const reviews = data || [];
    const totalReviews = reviews.length;
    
    if (totalReviews === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      };
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = Math.round((totalRating / totalReviews) * 10) / 10;

    const ratingDistribution = reviews.reduce((acc, review) => {
      acc[review.rating] = (acc[review.rating] || 0) + 1;
      return acc;
    }, {} as { [key: number]: number });

    // Fill in missing ratings with 0
    for (let i = 1; i <= 5; i++) {
      if (!ratingDistribution[i]) {
        ratingDistribution[i] = 0;
      }
    }

    return {
      averageRating,
      totalReviews,
      ratingDistribution
    };
  }
} 