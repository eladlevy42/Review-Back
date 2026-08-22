"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyGoogle = verifyGoogle;
exports.signWithGoogle = signWithGoogle;
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
const SALT_ROUNDS = 10;
const env_1 = require("../config/env");
// Google sign-in credentials must be verified against Google, not merely
// decoded. A decoded-only JWT is attacker-controlled: anyone can craft a
// payload with someone else's email and be logged in as them.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID
    ? new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID)
    : null;
async function verifyGoogle(req, res, next) {
    const { credential } = req.body;
    let credentialDecoded;
    if (!googleClient) {
        // Fail closed: without a client ID there is no way to verify the
        // credential, and accepting it unverified is what this guards against.
        return res
            .status(503)
            .json({ error: "Google sign-in is not configured on this server" });
    }
    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        if (!payload?.email || !payload.email_verified) {
            return res
                .status(401)
                .json({ error: "Google credential has no verified email" });
        }
        credentialDecoded = {
            email: payload.email,
            given_name: payload.given_name ?? "",
            family_name: payload.family_name ?? "",
        };
        req.credentialDecoded = credentialDecoded;
    }
    catch (err) {
        return res.status(401).json({ error: "Invalid Google credential" });
    }
    try {
        const { email } = credentialDecoded;
        let user = await user_model_1.User.findOne({ email });
        if (user) {
            req.user = user;
        }
    }
    catch (err) {
        return res.status(500).json({ error: err.message });
    }
    next();
}
async function signWithGoogle(req, res) {
    const { credentialDecoded } = req;
    if (!credentialDecoded)
        return res.status(500).json({ error: "Authentication with Google failed" });
    const { email, given_name: firstName, family_name: lastName, } = credentialDecoded;
    try {
        let user = req.user;
        if (!user) {
            const hashedPassword = await bcryptjs_1.default.hash(Math.random().toString(36).slice(-8), SALT_ROUNDS);
            user = new user_model_1.User({
                fullName: `${firstName} ${lastName}`,
                email,
                password: hashedPassword,
            });
            await user.save();
        }
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, env_1.JWT_SECRET, {
            expiresIn: "5h",
        });
        res.status(201).json({ token });
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ error: "Authentication with Google failed" });
    }
}
