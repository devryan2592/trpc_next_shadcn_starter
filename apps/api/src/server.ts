import dotenv from "dotenv";
dotenv.config();

import { json, urlencoded } from "body-parser";
import express, { type Express } from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import { trpcExpress } from "@repo/trpc-server";
import corsOptions from "./config/cors/corsOptions";

export const createServer = (): Express => {
  const app = express();
  app
    .disable("x-powered-by")
    .use(morgan("dev"))
    .use(cookieParser())
    .use(urlencoded({ extended: true }))
    .use(json())
    .use(cors(corsOptions))
    .get("/message/:name", (req, res) => {
      return res.json({ message: `hello ${req.params.name}` });
    })
    .get("/status", (_, res) => {
      return res.json({ ok: true, user: res.locals.session?.user ?? "guest" });
    });

  app.use("/api/trpc", trpcExpress);

  return app;
};
