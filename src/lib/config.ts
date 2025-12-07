"use client";
// Base API URL for server requests
export const API_BASE = 'https://nestjsproject-pqzl.onrender.com';

// AI model configuration (can be overridden via environment variables)
// Use `NEXT_PUBLIC_` prefix so these values are available on the client.
export const AI_MODEL = process.env.NEXT_PUBLIC_AI_MODEL ?? 'claude-haiku-4.5';
export const ENABLE_CLAUDE_HAIKU =
	(process.env.NEXT_PUBLIC_ENABLE_CLAUDE_HAIKU || 'true') === 'true';
