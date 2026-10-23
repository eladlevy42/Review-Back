"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWT_SECRET = void 0;
// Centralised, fail-fast access to required secrets.
// Throwing at startup is deliberate: a missing secret must never silently
// fall back to a hard-coded default that is readable in the repository.
function required(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing required environment variable ${name}. Set it in .env (see .env.example).`);
    }
    return value;
}
exports.JWT_SECRET = required("JWT_SECRET");
