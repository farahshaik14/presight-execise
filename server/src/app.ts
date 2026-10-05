import express from "express";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import type { DatabaseSync } from "node:sqlite";
import { apiNotFound, errorHandler, requestLogger, securityHeaders } from "./middleware.js";
import { peopleRouter } from "./people/routes.js";

interface AppOptions {
  db: DatabaseSync;
  clientDist?: string;
  logRequests?: boolean;
}

export function createApp({ db, clientDist, logRequests = false }: AppOptions) {
  const app = express();
  app.disable("x-powered-by");
  app.use(securityHeaders);
  if (logRequests) app.use(requestLogger);

  app.use("/api", (_req, res, next) => {
    res.setHeader("Cache-Control", "no-cache");
    next();
  });

  app.get("/api/health", (_req, res) => {
    db.prepare("SELECT 1").get();
    res.json({ status: "ok" });
  });

  app.use("/api/people", peopleRouter(db));
  app.use("/api", apiNotFound);

  if (clientDist && existsSync(clientDist)) {
    const indexHtml = resolve(clientDist, "index.html");
    app.use(express.static(clientDist, { index: false, maxAge: "1y", immutable: true }));
    app.get("/{*path}", (_req, res) => {
      res.setHeader("Cache-Control", "no-cache");
      res.sendFile(indexHtml);
    });
  }

  app.use(errorHandler);
  return app;
}
