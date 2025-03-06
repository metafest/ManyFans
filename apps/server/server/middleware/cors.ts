import { defineEventHandler, setResponseHeader, getRequestHeader } from "h3";

export default defineEventHandler((event) => {
  // Dynamically set CORS headers based on the Origin header
  const origin = getRequestHeader(event, "origin");

  // Define a list of allowed origins
  const allowedOrigins = [
    "http://localhost:3000",
    "http://manyfans.vercel.app",
  ];

  if (origin && allowedOrigins.includes(origin)) {
    setResponseHeader(event, "Access-Control-Allow-Origin", origin);
  }

  setResponseHeader(
    event,
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  setResponseHeader(
    event,
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  setResponseHeader(event, "Access-Control-Allow-Credentials", "true");

  // Handle preflight OPTIONS request
  if (event.method === "OPTIONS") {
    event.node.res.statusCode = 204;
    event.node.res.end();
    return;
  }
});
