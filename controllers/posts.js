import e from "cors";
import Post from "../model'/Post.js";
import User from "../models/User.js";

/* CREATE */
export const createPost = async (req, res) => {
    try {
        const { userId, description, picturePath } = req.body;
        const user = await User.findById(userId);
        const newPost = newPost({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: []
        })
        await newPost.save();

        const post = await Post.find();
        res.status(201).json(post)
    } catch (error) {
        res.status(409).json({"message": error.message})
    }
}

/* READ */
export const getFeedPosts = async (req, res) => {
    try {
        const post = await Post.find();
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

export const getUserPosts = async (req, res) => {
    try {
        const { userId } = req.params;
        const post = await Post.find({userId});
        res.status(200).json(post);
    } catch (error) {
        res.status(404).json({ message: error.message });
  }
};



/* READ */
export const likePost = async (req, res) => {
    try {
        const { id } = req.params;
        const { userId } = req.body;
        const post = await Post.findById(userId);

        //Check if the user's id exists in the post likes object
        const isLiked = post.likes.get(userId);

        //If the userId exists in the post.likes object, delete the userId form the likes object(if the user already liked the post, then unlike the post)
        if (isLiked) {
            post.likes.delete(userId)
        } else {//Add the userId to the likes object if it didn't previously exist
            post.likes.set(userId, true);
        }

      res.status(200).json();
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
}