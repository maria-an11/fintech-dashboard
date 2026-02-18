import { Router, Response, Request } from "express";
import { categories } from "../data/mockData";

const router = Router();

router.get("/", (req: Request, res: Response) => {
  try {
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

export default router;
