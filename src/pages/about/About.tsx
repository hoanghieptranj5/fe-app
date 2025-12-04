import React from "react";
import {
  Box,
  CardHeader,
  CardMedia,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  IconButton,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpAltOutlinedIcon from "@mui/icons-material/ThumbUpAltOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import { GlassyCard } from "../../components/glassyCard/GlassyCard";

// ==================== Types ====================
interface AboutPostData {
  id: string;
  authorName: string;
  authorHandle?: string;
  avatarChar: string;
  timestamp: string;
  sectionTitle?: string;
  content: string;
  imageUrl?: string;
  youtubeVideoId?: string;
  likeCount?: number;
  commentCount?: number;
}

// ==================== Sample Data ====================
const aboutPostsData: AboutPostData[] = [
  {
    id: "post1",
    authorName: "Our Website",
    authorHandle: "@WebsiteOfficial",
    avatarChar: "W",
    timestamp: "March 26, 2025",
    sectionTitle: "Welcome & Our Mission",
    content: `Welcome to our platform! We're dedicated to showcasing the power of modern web technologies.\n\nOur mission is to demonstrate how React, TypeScript, and Material UI can create elegant, responsive, and user-friendly web experiences, styled with the flexibility of SCSS Modules.`,
    likeCount: 15,
    commentCount: 3,
  },
  {
    id: "post2",
    authorName: "Our Website",
    avatarChar: "W",
    timestamp: "Core Technology",
    sectionTitle: "Technology Stack",
    content: `This application is built using a combination of industry-leading tools:\n
    • React: For building dynamic user interfaces.
    • TypeScript: For enhanced code quality and maintainability.
    • Material UI (MUI): Providing a rich library of pre-designed components.
    • SCSS Modules: For creating scoped and organized stylesheets.`,
    imageUrl: "https://picsum.photos/seed/tech/600/300",
    likeCount: 28,
    commentCount: 7,
  },
  {
    id: "post4",
    authorName: "Our Website",
    avatarChar: "W",
    timestamp: "Featured Video",
    content: `Here's a look at how Material UI components can be customized and used effectively in a React project.\n\n(Remember to replace the video ID with a real one if needed!)`,
    youtubeVideoId: "qANs6WqUCcc",
    likeCount: 42,
    commentCount: 11,
  },
  {
    id: "post3",
    authorName: "Our Website",
    avatarChar: "W",
    timestamp: "Looking Ahead",
    sectionTitle: "Future Goals",
    content: `We are constantly evolving! Future plans include integrating more interactive features, potentially adding state management solutions like Redux or Zustand, and connecting to backend services for dynamic data.\n\nStay tuned for more updates!`,
    imageUrl: "https://picsum.photos/seed/future/600/300",
    likeCount: 12,
    commentCount: 2,
  },
];

// ==================== Styled Components ====================

// Full page background – proper dark mode
const GlassyPage = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  padding: theme.spacing(4),
  display: "flex",
  justifyContent: "center",
  background:
    theme.palette.mode === "dark"
      ? "radial-gradient(circle at top left, #1e293b 0, #020617 40%, #000 100%)"
      : "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 50%, #f9fafb 100%)",
  color:
    theme.palette.mode === "dark"
      ? "rgba(248,250,252,0.96)"
      : theme.palette.text.primary,
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const GlassyAvatar = styled(Avatar)(() => ({
  background:
    "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(56,189,248,0.9))",
  color: "#0b1120",
  fontWeight: 700,
}));

const VideoWrapper = styled(Box)(() => ({
  position: "relative",
  marginTop: 8,
  marginBottom: 8,
  paddingTop: "56.25%", // 16:9
  borderRadius: 18,
  overflow: "hidden",
  boxShadow: "0 18px 45px rgba(15,23,42,0.9)",
  "& iframe": {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    border: 0,
  },
}));

const GlassyMedia = styled(CardMedia)(() => ({
  borderRadius: 18,
  marginTop: 8,
  marginBottom: 8,
  overflow: "hidden",
  boxShadow: "0 18px 45px rgba(15,23,42,0.85)",
}));

const ActionsRow = styled(CardActions)(({ theme }) => ({
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(0.5),
  display: "flex",
  alignItems: "center",
  gap: theme.spacing(1),
  "& .MuiIconButton-root": {
    color: "rgba(148,163,184,0.95)",
    paddingInline: theme.spacing(1),
    borderRadius: 999,
    transition: "background 120ms ease-out, transform 80ms ease-out",
    "&:hover": {
      background: "rgba(51,65,85,0.9)",
      transform: "translateY(-1px)",
    },
  },
}));

// ==================== Component ====================
const About: React.FC = () => {
  const handleLike = (postId: string) => console.log(`Liked post ${postId}`);
  const handleComment = (postId: string) =>
    console.log(`Comment on post ${postId}`);
  const handleShare = (postId: string) => console.log(`Shared post ${postId}`);

  return (
    <GlassyPage>
      <Box sx={{ width: "100%", maxWidth: 720 }}>
        {aboutPostsData.map((post) => (
          <GlassyCard key={post.id} sx={{ mb: 3 }}>
            {/* Header */}
            <CardHeader
              avatar={
                <GlassyAvatar aria-label={`Author ${post.authorName}`}>
                  {post.avatarChar}
                </GlassyAvatar>
              }
              action={
                <IconButton aria-label="settings" size="small">
                  <MoreHorizIcon />
                </IconButton>
              }
              titleTypographyProps={{
                variant: "subtitle1",
                sx: { fontWeight: 600 },
              }}
              subheaderTypographyProps={{
                variant: "caption",
                sx: { color: "rgba(148,163,184,0.95)" },
              }}
              title={`${post.authorName}${
                post.authorHandle ? ` (${post.authorHandle})` : ""
              }`}
              subheader={post.timestamp}
              sx={{
                paddingX: 0,
                paddingTop: 0,
                paddingBottom: 1,
              }}
            />

            {/* Media: video > image */}
            {post.youtubeVideoId ? (
              <VideoWrapper>
                <iframe
                  src={`https://www.youtube.com/embed/${post.youtubeVideoId}`}
                  title={
                    post.sectionTitle || post.authorName || "YouTube video player"
                  }
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              </VideoWrapper>
            ) : post.imageUrl ? (
              <GlassyMedia
                image={post.imageUrl}
                sx={{
                  height: { xs: 250, sm: 350 },
                  objectFit: "cover",
                  width: "100%",
                }}
              />
            ) : null}

            {/* Content */}
            <CardContent
              sx={{ paddingX: 0, paddingTop: 1.5, paddingBottom: 1 }}
            >
              {post.sectionTitle && (
                <Typography
                  variant="h6"
                  component="h2"
                  sx={{ mb: 0.75, fontWeight: 600 }}
                >
                  {post.sectionTitle}
                </Typography>
              )}
              <Typography
                variant="body1"
                component="p"
                sx={{
                  whiteSpace: "pre-line",
                  color: "rgba(226,232,240,0.92)",
                  fontSize: 14.5,
                }}
              >
                {post.content}
              </Typography>
            </CardContent>

            {/* Actions */}
            <ActionsRow disableSpacing>
              <IconButton
                aria-label="like post"
                onClick={() => handleLike(post.id)}
              >
                <ThumbUpAltOutlinedIcon fontSize="small" />
                {post.likeCount !== undefined && (
                  <Typography
                    variant="body2"
                    sx={{ ml: 0.5, fontSize: 12, color: "rgba(203,213,225,0.96)" }}
                  >
                    {post.likeCount}
                  </Typography>
                )}
              </IconButton>

              <IconButton
                aria-label="comment on post"
                onClick={() => handleComment(post.id)}
              >
                <ChatBubbleOutlineOutlinedIcon fontSize="small" />
                {post.commentCount !== undefined && (
                  <Typography
                    variant="body2"
                    sx={{ ml: 0.5, fontSize: 12, color: "rgba(203,213,225,0.96)" }}
                  >
                    {post.commentCount}
                  </Typography>
                )}
              </IconButton>

              <IconButton
                aria-label="share post"
                sx={{ marginLeft: "auto" }}
                onClick={() => handleShare(post.id)}
              >
                <ShareOutlinedIcon fontSize="small" />
              </IconButton>
            </ActionsRow>
          </GlassyCard>
        ))}
      </Box>
    </GlassyPage>
  );
};

export default About;
