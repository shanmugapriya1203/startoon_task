import User from "../models/User.js";
import NodeCache from 'node-cache';


 export const cache = new NodeCache();

export const getAllUsers = async (req, res, next) => {
  try {
 
    const cachedUsers = cache.get('allusers');
    if (cachedUsers) {
      console.log('Fetching users from cache');
      return res.status(200).json(cachedUsers);
    }

    const users = await User.find({ isAdmin: false });
    

    cache.set('allusers', users, 600);

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Failed to fetch users" });
    next(error);
  }
};

export const getUserCounts = async (req, res, next) => {
    try {

      const cachedUserCounts = cache.get('userCounts');
      if (cachedUserCounts) {
        console.log('Fetching user counts from cache');
        return res.status(200).json(cachedUserCounts);
      }

      const userCounts = await User.aggregate([
        { 
          $match: { isAdmin: false } 
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m", date: "$lastLoginDate" } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ]);

      const userCountsMap = {};
      userCounts.forEach((item) => {
        userCountsMap[item._id] = item.count;
      });

      cache.set('userCounts', userCountsMap, 600);
  
      res.status(200).json(userCountsMap);
    } catch (error) {
      console.error("Error fetching user counts:", error);
      res.status(500).json({ message: "Failed to fetch user counts" });
      next(error);
    }
  };
  
