/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import { User } from "../model/userModel";
import { z } from "zod";
import { UserSchema } from "../validation/user.validation";

export const homeController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: z.infer<typeof UserSchema>[] = await User.find()
        if (data.length === 0) {
            res.status(400).json({
                success: false
            });
        }
        return res.status(200).json({
            success: true,
            userTotal: data.length,
            data
        })
    } catch (error) {
        console.error(error)
        res.status(400).json({
            success: false
        })
        next(error)
    }
}

export const searchUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const inputSearch: string = req.params.inputSearch
        let user: z.infer<typeof UserSchema> | null
        if (inputSearch !== undefined) {
            user = await User.findOne({ "username": inputSearch })

            if (!user) {
                user = await User.findOne({ "_id": inputSearch })
            }
            if (user === null) {
                return res.status(400).json({
                    success: false
                })
            }
            return res.status(200).json({
                success: true,
                user
            })
        }


    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'User not found'
        })
        next(error)
    }
}

export const addUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: z.infer<typeof UserSchema> = UserSchema.parse(await req.body)
        if (data !== undefined) {
            const { name, username, city, status } = data
            const checkUsername = await User.findOne({ "username": username })
            if (checkUsername !== null) {
                return res.status(400).json({
                    success: false,
                    message: 'use another username'
                })
            }
            const addUser = await new User({
                name,
                username,
                city,
                status,
                addTime: new Date(Date.now())
            })
            await addUser.save()
            return res.status(200).json({
                success: true,
                user: addUser
            })

        }

    } catch (error) {
        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                error: error.issues.map((e) => { return `${e.path[0]} ${e.message}` })
            })
        } else {
            res.status(400).json({
                success: false
            })
        }
        next(error)
    }

}

export const updateUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const idUser = req.params.idUserParams
        const { name, username, city, status }: z.infer<typeof UserSchema> = await req.body
        const user = await User.findById(idUser)

        const sameUsername = await User.find({ username })
        if (user === null) {
            res.send(400).json({
                success: false,
                message: 'User not found'
            })
        }
        if (sameUsername.length !== 0) {
            if (sameUsername[0]._id.toString() !== user!._id.toString()) {
                return res.status(400).json({
                    success: false,
                    message: 'use another username'
                })
            }
        }
        if (user !== null) {
            user.name = name,
                user.username = username,
                user.city = city,
                user.status = status,
                // user.addTime = new Date(Date.now())
                await user.save()
            return res.status(200).json({
                success: true,
                user
            })
        }

    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Update user fail'
        })
        next(error)
    }
}

export const deleteUserController = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.idUserParams
        const Response = await User.findByIdAndDelete(userId)
        if (!Response) {
            return res.status(400).json({
                success: false,
                message: 'No User found with this Id'
            })
        }

        return res.status(200).json({
            success: true,
            message: `User ${Response.username} succesfully deleted`,
            user: Response
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Delete user fail'
        })
        next(error)
    }
}