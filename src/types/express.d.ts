import { JwtPayload } from "../utils/jwt.js";
import { IUser } from "../models/User.js";

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayload | IUser;
        }
    }
}
