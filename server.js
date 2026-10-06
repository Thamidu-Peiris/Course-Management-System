import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import xss from "xss";
import cookieParser from "cookie-parser";
import { ProtectRoute } from "./middlewares/ProtectRoute.js";
import CourseRoute from "./routes/course.routes.js";
import AdminRoute from "./routes/admin.routes.js";

const app = express();

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https:"],
        connectSrc: ["'self'", "http://localhost:5173"],
        objectSrc: ["'none'"],
        frameAncestors: ["'self'"],
        upgradeInsecureRequests: [],
      },
    },
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  })
);

app.use(express.json({ limit: "10kb" }));

app.use((req, res, next) => {
  const sanitize = (value) => {
    if (typeof value === "string") return xss(value);
    if (Array.isArray(value)) return value.map(sanitize);
    if (value !== null && typeof value === "object") {
      return Object.fromEntries(
        Object.entries(value).map(([key, val]) => [key, sanitize(val)])
      );
    }
    return value;
  };

  if (req.body) req.body = sanitize(req.body);
  next();
});

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use("/api/v1/admin", AdminRoute);

app.use(ProtectRoute);
app.use("/api/v1/course", CourseRoute);

app.listen(9000, () => console.log("server is running"));
