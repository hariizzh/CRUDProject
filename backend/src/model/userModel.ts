import { model, Schema } from 'mongoose';

export interface IUser {
    name: string;
    username: string;
    city: string;
    status: string;
    addTime: Date;
}

const userSchema = new Schema<IUser>({
    name: String,
    username: String,
    city: String,
    status: String,
    addTime: Date
})
export const User = model<IUser>('User', userSchema);
