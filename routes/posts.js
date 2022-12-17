import express from "express";
import { getFeedPosts, getUserPosts, likeposts } from "../controllers/posts.js";
import { verifyToken } from "../middleware/auth.js";


const router = express.Roiuter();

/* READ */
router.get("/", verifyToken, getFeedPosts);
router.get("/:userId/posts", verifyToken, getUserPosts);


/* UPDATE */
router.patch("/:id/like", verifyToken, likeposts);

export default router;


