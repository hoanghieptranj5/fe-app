import React from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
} from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbUpAltOutlinedIcon from '@mui/icons-material/ThumbUpAltOutlined';
import ChatBubbleOutlineOutlinedIcon from '@mui/icons-material/ChatBubbleOutlineOutlined';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';

// Import the SCSS module
import styles from './About.module.scss';

// Interface for the data structure of each "post"
interface AboutPostData {
  id: string;
  authorName: string;
  authorHandle?: string;
  avatarChar: string;
  timestamp: string;
  sectionTitle?: string;
  content: string;
  imageUrl?: string; // Optional URL for an image
  youtubeVideoId?: string; // Optional YouTube Video ID
  likeCount?: number; // Optional placeholder like count
  commentCount?: number; // Optional placeholder comment count
}

// --- Sample Data for the About Sections ---
// Remember: Current date is Wednesday, March 26, 2025
const aboutPostsData: AboutPostData[] = [
  {
    id: 'post1',
    authorName: 'Our Website',
    authorHandle: '@WebsiteOfficial',
    avatarChar: 'W',
    timestamp: 'March 26, 2025',
    sectionTitle: 'Welcome & Our Mission',
    content: `Welcome to our platform! We're dedicated to showcasing the power of modern web technologies.\n\nOur mission is to demonstrate how React, TypeScript, and Material UI can create elegant, responsive, and user-friendly web experiences, styled with the flexibility of SCSS Modules.`,
    likeCount: 15,
    commentCount: 3,
  },
  {
    id: 'post2',
    authorName: 'Our Website',
    avatarChar: 'W',
    timestamp: 'Core Technology',
    sectionTitle: 'Technology Stack',
    content: `This application is built using a combination of industry-leading tools:\n
    •   **React:** For building dynamic user interfaces.
    •   **TypeScript:** For enhanced code quality and maintainability.
    •   **Material UI (MUI):** Providing a rich library of pre-designed components.
    •   **SCSS Modules:** For creating scoped and organized stylesheets.`,
    imageUrl: 'https://picsum.photos/seed/tech/600/300',
    likeCount: 28,
    commentCount: 7,
  },
  {
    id: 'post4', // Changed ID from post3 in previous example to make video distinct
    authorName: 'Our Website',
    avatarChar: 'W',
    timestamp: 'Featured Video',
    content: `Here's a look at how Material UI components can be customized and used effectively in a React project. \n\n(Remember to replace 'YOUR_YOUTUBE_VIDEO_ID' below with a real ID!)`,
    // No imageUrl for this post
    // IMPORTANT: Replace 'dQw4w9WgXcQ' with a valid YouTube Video ID
    youtubeVideoId: 'qANs6WqUCcc',
    likeCount: 42,
    commentCount: 11,
  },
  {
    id: 'post3', // Original post3 content
    authorName: 'Our Website',
    avatarChar: 'W',
    timestamp: 'Looking Ahead',
    sectionTitle: 'Future Goals',
    content: `We are constantly evolving! Future plans include integrating more interactive features, potentially adding state management solutions like Redux or Zustand, and connecting to backend services for dynamic data.\n\nStay tuned for more updates!`,
    imageUrl: 'https://picsum.photos/seed/future/600/300',
    likeCount: 12,
    commentCount: 2,
  },
];
// --- End Sample Data ---


const About: React.FC = () => {
  // Placeholder handlers - implement actual logic if needed
  const handleLike = (postId: string) => console.log(`Liked post ${postId}`);
  const handleComment = (postId: string) => console.log(`Comment on post ${postId}`);
  const handleShare = (postId: string) => console.log(`Shared post ${postId}`);

  return (
    // Main feed container
    <Box className={styles.feedContainer}>
      {/* Map through the data to render each post */}
      {aboutPostsData.map((post) => (
        <Card key={post.id} className={styles.postCard} elevation={0} variant="outlined">
          {/* Post Header */}
          <CardHeader
            avatar={
              <Avatar className={styles.avatar} aria-label={`Author ${post.authorName}`}>
                {post.avatarChar}
              </Avatar>
            }
            action={
              <IconButton aria-label="settings">
                <MoreHorizIcon />
              </IconButton>
            }
            title={`${post.authorName} ${post.authorHandle ? `(${post.authorHandle})` : ''}`}
            subheader={post.timestamp}
          />

          {/* Media Section: Video > Image > None */}
          {post.youtubeVideoId ? (
            // YouTube Video Embed
            <Box className={styles.videoWrapper}>
              <iframe
                src={`https://www.youtube.com/embed/${post.youtubeVideoId}`}
                title={post.sectionTitle || post.authorName || 'YouTube video player'}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </Box>
          ) : post.imageUrl ? (
            // Image Display
            <CardMedia
              component="img"
              sx={{ maxHeight: { xs: 250, sm: 350 }, objectFit: 'cover', width: '100%' }}
              image={post.imageUrl}
              alt={post.sectionTitle || 'Post image'}
              className={styles.cardMedia}
            />
          ) : null /* Render nothing if no video or image */}

          {/* Post Content */}
          <CardContent className={styles.cardContent}>
            {post.sectionTitle && (
              <Typography variant="h6" component="h2" className={styles.sectionTitleInContent}>
                {post.sectionTitle}
              </Typography>
            )}
            <Typography variant="body1" component="p" className={styles.paragraph}>
              {post.content}
            </Typography>
          </CardContent>

          {/* Post Actions */}
          <CardActions disableSpacing className={styles.cardActions}>
            <IconButton aria-label="like post" onClick={() => handleLike(post.id)}>
              <ThumbUpAltOutlinedIcon fontSize="small"/> {/* Use small icons in actions */}
              {post.likeCount !== undefined && (
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {post.likeCount}
                </Typography>
              )}
            </IconButton>
            <IconButton aria-label="comment on post" onClick={() => handleComment(post.id)}>
              <ChatBubbleOutlineOutlinedIcon fontSize="small"/>
              {post.commentCount !== undefined && (
                <Typography variant="body2" sx={{ ml: 0.5 }}>
                  {post.commentCount}
                </Typography>
              )}
            </IconButton>
            <IconButton
              aria-label="share post"
              sx={{ marginLeft: 'auto' }}
              onClick={() => handleShare(post.id)}
            >
              <ShareOutlinedIcon fontSize="small"/>
            </IconButton>
          </CardActions>
        </Card>
      ))}
    </Box>
  );
};

export default About;