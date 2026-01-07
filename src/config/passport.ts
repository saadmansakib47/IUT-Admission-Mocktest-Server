import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { User } from "../models/User.js";
import crypto from "crypto";

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
            callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const email = profile.emails?.[0].value;
                if (!email) {
                    return done(new Error("No email found in Google profile"));
                }

                // Check if user already exists
                let user = await User.findOne({ email });

                if (!user) {
                    // Generate a random secure password hash for OAuth users
                    // They'll never use it since they login via Google
                    const randomPassword = crypto.randomBytes(32).toString("hex");

                    // Create new user with Google OAuth
                    user = await User.create({
                        email,
                        passwordHash: randomPassword, // Required by schema but won't be used
                        role: "student",
                        isEmailVerified: true,
                    });
                }

                return done(null, user);
            } catch (err) {
                console.error("Google OAuth Strategy Error:", err);
                return done(err as Error);
            }
        }
    )
);

export default passport;