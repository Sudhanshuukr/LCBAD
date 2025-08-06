import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { MessageCircle, Star, BarChart3 } from "lucide-react";

interface ReviewsSectionProps {
  storyId: string;
}

export default function ReviewsSection({ storyId }: ReviewsSectionProps) {
  const [activeTab, setActiveTab] = useState("reviews");
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          Reviews & Ratings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-700">
            <TabsTrigger 
              value="reviews" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Reviews
            </TabsTrigger>
            <TabsTrigger 
              value="stats" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistics
            </TabsTrigger>
            <TabsTrigger 
              value="write" 
              className="data-[state=active]:bg-cyan-600 data-[state=active]:text-white"
            >
              <Star className="h-4 w-4 mr-2" />
              Write Review
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reviews" className="mt-6">
            <ReviewList 
              storyId={storyId} 
              onReviewsChange={handleReviewSubmitted}
              key={refreshKey}
            />
          </TabsContent>
          
          <TabsContent value="stats" className="mt-6">
            <ReviewList 
              storyId={storyId} 
              onReviewsChange={handleReviewSubmitted}
              key={refreshKey}
            />
          </TabsContent>
          
          <TabsContent value="write" className="mt-6">
            <ReviewForm 
              storyId={storyId} 
              onReviewSubmitted={handleReviewSubmitted}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 