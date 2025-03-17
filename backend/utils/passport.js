import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../models/user.model.js";

// Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:9001/api/v1/user/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });

        if (!user) {
          // Create a new user if they don't exist
          user = await User.create({
            fullname: profile.displayName,
            email: profile.emails[0].value,
            password: "", // No password for OAuth users
            role: "student", // Default role
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:9001/api/v1/user/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let email = profile.emails?.[0]?.value || null;

        if (!email) {
          const response = await fetch("https://api.github.com/user/emails", {
            headers: { Authorization: `token ${accessToken}` },
          });
          const emails = await response.json();
          email = emails.find(e => e.primary)?.email || null;
        }

        if (!email) {
          return done(new Error("Email not found"), null);
        }

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            fullname: profile.displayName || profile.username,
            email,
            password: "",
            role: "student",
          });
        }

        if (!user) {
          return done(new Error("User creation failed"), null);
        }

        return done(null, user); // ✅ Ensure user is not null
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  if (!user || !user._id) {
    return done(new Error("User ID not found during serialization"), null);
  }
  done(null, user._id); // ✅ Store only the user ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      return done(new Error("User not found during deserialization"), null);
    }
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
