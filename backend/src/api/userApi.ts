import express from "express";
import { addUserController, deleteUserController, homeController, searchUserController, updateUserController } from "../controller/userController";


const userApiRouter = express.Router()

userApiRouter.get('/home', homeController)
userApiRouter.get('/search/:inputSearch', searchUserController)
userApiRouter.post('/user/add', addUserController)
userApiRouter.put('/user/update/:idUserParams', updateUserController)
userApiRouter.delete('/user/delete/:idUserParams', deleteUserController)

export default userApiRouter