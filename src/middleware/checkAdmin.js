  const Role = require("../models/role");  // Assuming you have a model named Role that stores user roles

  const checkAdmin = async (req, res, next) => {
    try {
      const userId = req.body.userId; // Assuming userId is sent in the request body
      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      // Check if the user exists and retrieve their role
      const userRole = await Role.findOne({ userId }); // Assuming Role model contains userId and role
      console.log(userRole);
      if (!userRole) {
        return res.status(403).json({ message: "User role not found" });
      }

      // Set isAdmin to true if the role is admin, else false
      req.isAdmin = userRole.role === "admin"; 

      next(); // Always proceed to the next middleware or route handler

    } catch (error) {
      console.error("Error in checkAdmin middleware:", error);
      return res.status(500).json({ message: "Internal server error while checking admin access." });
    }
  };

  module.exports = checkAdmin;
