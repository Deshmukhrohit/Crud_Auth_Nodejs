import jwt from "jsonwebtoken";

// export const verifyToken = (req, res, next) => {
//     // Retrieve the token from the Authorization header
//     const authHeader = req.headers['authorization'];
//     const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer <token>"

//     if (!token) {
//         return res.status(403).json({ message: "No token provided." });
//     }

//     try {
//         // Verify the token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
//         req.user = decoded; // Add the decoded user info to the request object
//         next(); // Continue to the next middleware
//     } catch (error) {
//         return res.status(401).json({ message: "Invalid token." });
//     }
// };

export const verifyToken = (req, res, next) => {
    // Retrieve the access token from the Authorization header
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Get token from "Bearer <token>"

    // If no token, check for refreshToken in cookies
    if (!token && req.cookies && req.cookies.refreshToken) {
        req.refreshToken = req.cookies.refreshToken;
        return next(); // If using refreshToken, go to next step or middleware to refresh the access token
    }

    if (!token) {
        return res.status(403).json({ message: "No token provided." });
    }

    try {
        // Verify the access token
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ACCESS);
        req.user = decoded; // Add the decoded user info to the request object
        next(); // Continue to the next middleware
    } catch (error) {
        return res.status(401).json({ message: "Invalid token." });
    }
};