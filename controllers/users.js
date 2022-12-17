import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ "messsage": error.message })
    }
    
};


export const getUserFriends = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return {
                    _id,
                    firstName,
                    lastName,
                    occupation,
                    location,
                    picturePath,
                };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (error) {
        res.status(404).json({ "messsage": error.message })
    }
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
      const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);
        const friends = await Promise.all(
          user.friends.map((id) => User.findById(id))
        );

        
        //Check if 'friendId' exists in the main user's friend list
        if (user.friends.includes(friendId)) {/* REMOVE FRIEND */
            //Remove the friend from the user's friend list
            user.friends = user.friends.filter((id) => id !== friendId);
            //Remove the user from the friends' friend list
            friends.friends = friends.friends.filter((id) => id !== id);
        } else {/* ADD FRIEND */
          //if 'friendId' doesn't exist in the main user's friend list
          user.friends.push(friendId);//Add friend to the main users friend list using 'friendId'
          friend.friends.push(id);//Add the main user to the friends' friend list using 'id'
        }

        //To save the updated lists
        await user.save();
        await friend.save();

        const formattedFriends = friends.map(
          ({ _id, firstName, lastName, occupation, location, picturePath }) => {
            return {
              _id,
              firstName,
              lastName,
              occupation,
              location,
              picturePath,
            };
          }
        );
        res.status(200).json(formattedFriends);
      
    } catch (error) {
      res.status(404).json({ messsage: error.message });
    }
}