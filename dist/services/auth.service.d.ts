export declare const createUser: (username: string, email: string, password: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/User.js").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models/User.js").IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const authenticateUser: (email: string, password: string) => Promise<import("mongoose").Document<unknown, {}, import("../models/User.js").IUser, {}, import("mongoose").DefaultSchemaOptions> & import("../models/User.js").IUser & Required<{
    _id: import("mongoose").Types.ObjectId;
}> & {
    __v: number;
} & {
    id: string;
}>;
export declare const generateTokens: (userId: string, role: "student" | "admin") => Promise<{
    accessToken: string;
    refreshToken: string;
}>;
export declare const rotateRefreshToken: (userId: string, refreshToken: string) => Promise<string>;
export declare const logoutUser: (userId: string) => Promise<void>;
export declare const createResetToken: (email: string) => Promise<string | undefined>;
//# sourceMappingURL=auth.service.d.ts.map