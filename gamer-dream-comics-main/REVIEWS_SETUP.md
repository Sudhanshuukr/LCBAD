# Reviews System Setup Guide

## Overview
I've successfully implemented a comprehensive reviews and ratings system for your comic stories. This system allows users to:
- Rate stories from 1-5 stars
- Write comments/reviews (up to 500 characters)
- View review statistics and ratings
- Edit or delete their own reviews
- See review summaries on the stories page

## What's Been Added

### 1. Database Schema
- **Reviews Table**: Stores user reviews with ratings, comments, and timestamps
- **Row Level Security**: Ensures users can only modify their own reviews
- **Indexes**: Optimized for fast queries
- **Triggers**: Automatic timestamp updates

### 2. Components Created
- `ReviewForm.tsx`: Form for submitting/editing reviews
- `ReviewList.tsx`: Displays all reviews with statistics
- `ReviewsSection.tsx`: Tabbed interface combining form and list
- `StoryCardWithReviews.tsx`: Enhanced story cards with review info
- `reviewsService.ts`: Service layer for all review operations

### 3. Updated Pages
- `StoryReader.tsx`: Now includes reviews section at the bottom
- `Stories.tsx`: Uses enhanced story cards with review statistics

## Setup Instructions

### Step 1: Create the Database Table
1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `setup-reviews-table.sql`
4. Run the SQL script

### Step 2: Update TypeScript Types (Optional)
If you're using Supabase CLI and want to regenerate types:
```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/integrations/supabase/types.ts
```

### Step 3: Test the Feature
1. Start your development server: `npm run dev`
2. Navigate to any story page
3. Scroll down to see the new "Reviews & Ratings" section
4. Try submitting a review with a rating and comment

## Features Included

### Review Form
- ⭐ Star rating system (1-5 stars)
- 📝 Optional comment field (500 character limit)
- ✏️ Edit existing reviews
- 🗑️ Delete reviews
- ✅ Form validation and error handling

### Review Display
- 📊 Review statistics (average rating, total reviews)
- 📈 Rating distribution chart
- 👤 User avatars and names
- 📅 Review timestamps
- 💬 Comment display

### Integration
- 🔗 Seamlessly integrated into existing story pages
- 📱 Responsive design matching your theme
- 🎨 Consistent with your cyberpunk aesthetic
- ⚡ Real-time updates when reviews are added/edited

## Database Schema Details

```sql
reviews table:
- id: UUID (primary key)
- user_id: UUID (references auth.users)
- story_id: TEXT (story identifier)
- rating: INTEGER (1-5 stars)
- comment: TEXT (optional)
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- UNIQUE(user_id, story_id) - one review per user per story
```

## Security Features
- ✅ Row Level Security enabled
- ✅ Users can only modify their own reviews
- ✅ All users can view all reviews
- ✅ Input validation and sanitization
- ✅ Error handling and user feedback

## Usage Examples

### Submitting a Review
1. Navigate to any story page
2. Scroll to the "Reviews & Ratings" section
3. Click the "Write Review" tab
4. Select a rating (1-5 stars)
5. Optionally add a comment
6. Click "Submit Review"

### Viewing Reviews
- Reviews are displayed in the "Reviews" tab
- Statistics are shown in the "Statistics" tab
- Reviews are sorted by date (newest first)

### Story Cards
- Story cards now show average ratings
- Review counts are displayed
- Stars indicate the average rating

## Troubleshooting

### Common Issues
1. **"Cannot find project ref"**: Make sure your Supabase project is properly linked
2. **Type errors**: Regenerate types after creating the table
3. **RLS errors**: Ensure the SQL policies were created correctly

### Manual Database Setup
If the Supabase CLI isn't working, manually run the SQL in your Supabase dashboard:
1. Go to your Supabase project
2. Click "SQL Editor"
3. Paste the contents of `setup-reviews-table.sql`
4. Click "Run"

## Next Steps
The reviews system is now fully functional! You can:
- Test the feature with your existing stories
- Customize the styling to match your preferences
- Add additional features like review helpfulness voting
- Implement review moderation if needed

The system is designed to be scalable and maintainable, with proper error handling and user experience considerations. 