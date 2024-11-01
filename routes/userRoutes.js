import express from "express"
import { fetch, create, update, userDelete } from "../controller/userController.js"
import { signup, login, refreshToken } from "../controller/authController.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const route = express.Router();

route.post("/signup", signup);
route.post("/login", login);
route.post("/refresh",refreshToken);

route.post("/create",verifyToken, create);
route.get("/getAllUsers", verifyToken, fetch)
route.put("/update/:id", verifyToken , update);
route.delete("/delete/:id",verifyToken, userDelete);

export default route;
