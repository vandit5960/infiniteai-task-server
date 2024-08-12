import UserModel from "../model/userModel.js";

export const getUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
  
    const users = await UserModel.find({
      status: true,
      role: "user",
    })
    .skip(skip)
    .limit(limit);

   
    const totalUsers = await UserModel.countDocuments({
      status: true,
      role: "user",
    });

    console.log(totalUsers,users.length)

    res.status(200).json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
      totalRecords: totalUsers,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};


export const getAdminUsers = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    

    const users = await UserModel.find({ status: true }).skip(skip).limit(limit);
    const totalUsers = await UserModel.countDocuments({ status: true });

 

    res.json({
      users,
      totalPages: Math.ceil(totalUsers / limit),
      totalRecords: totalUsers
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const deleteUsers = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await UserModel.findOneAndUpdate(
      { _id: id },
      { $set: { status: false } }
    );
    res.status(200).json({ message: "Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server Error" });
  }
};



export const updateUsers = async (req, res) => {
  const { _id, email } = req.body; 
  let error = {}; 

  try {
   
    const existingUser = await UserModel.findOne({ email, _id: { $ne: _id } });

    if (existingUser) {
      error.email = "Email already exists";
    }

    if (Object.keys(error).length > 0) {
      return res.status(400).json(error);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(
      _id,
      req.body, 
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Return the updated user
    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


