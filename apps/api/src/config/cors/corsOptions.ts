import { CorsOptions } from "cors";
import allowedOrigins from "./allowedOrigins";

const corsOptions: CorsOptions = {
  origin: (origin, cb) => {
    if (allowedOrigins.indexOf(origin!) !== -1 || !origin) {
      cb(null, true);
    } else {
      cb(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  exposedHeaders: ["set-cookie"],
};

export default corsOptions;
