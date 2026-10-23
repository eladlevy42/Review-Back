import { NextFunction, Request, Response } from "express";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcryptjs from "bcryptjs";
import { User, IUser } from "../models/user.model";
import { Document } from "mongoose";

const SALT_ROUNDS = 10;
import { JWT_SECRET } from "../config/env";

// Google sign-in credentials must be verified against Google, not merely
// decoded. A decoded-only JWT is attacker-controlled: anyone can craft a
// payload with someone else's email and be logged in as them.
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const googleClient = GOOGLE_CLIENT_ID
  ? new OAuth2Client(GOOGLE_CLIENT_ID)
  : null;

interface GoogleCredential {
  email: string;
  given_name: string;
  family_name: string;
}

interface VerifyGoogleRequest extends Request {
  body: { credential: string };
  credentialDecoded?: GoogleCredential;
  user?: Document<unknown, {}, IUser> & IUser;
}

interface SignWithGoogleRequest extends Request {
  credentialDecoded?: GoogleCredential;
  user?: Document<unknown, {}, IUser> & IUser;
}

async function verifyGoogle(
  req: VerifyGoogleRequest,
  res: Response,
  next: NextFunction
) {
  const { credential } = req.body;

  let credentialDecoded: GoogleCredential;

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
      audience: GOOGLE_CLIENT_ID as string,
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
  } catch (err) {
    return res.status(401).json({ error: "Invalid Google credential" });
  }

  try {
    const { email } = credentialDecoded;
    let user = await User.findOne({ email });

    if (user) {
      req.user = user;
    }
  } catch (err) {
    return res.status(500).json({ error: (err as Error).message });
  }

  next();
}

async function signWithGoogle(req: SignWithGoogleRequest, res: Response) {
  const { credentialDecoded } = req;

  if (!credentialDecoded)
    return res.status(500).json({ error: "Authentication with Google failed" });

  const {
    email,
    given_name: firstName,
    family_name: lastName,
  } = credentialDecoded;

  try {
    let user = req.user;
    if (!user) {
      const hashedPassword = await bcryptjs.hash(
        Math.random().toString(36).slice(-8),
        SALT_ROUNDS
      );
      user = new User({
        fullName: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
      });
      await user.save();
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET!, {
      expiresIn: "5h",
    });
    res.status(201).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Authentication with Google failed" });
  }
}

export { verifyGoogle, signWithGoogle };
