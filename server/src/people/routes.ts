import { Router } from "express";
import type { DatabaseSync } from "node:sqlite";
import { parseFilters, parseListParams } from "./params.js";
import { getFacets, listPeople } from "./repository.js";

export function peopleRouter(db: DatabaseSync): Router {
  const router = Router();

  router.get("/", (req, res) => {
    res.json(listPeople(db, parseListParams(req.query)));
  });

  router.get("/facets", (req, res) => {
    res.json(getFacets(db, parseFilters(req.query)));
  });

  return router;
}
