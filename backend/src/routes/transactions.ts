import { Router, Request, Response } from "express";
import {
  categories,
  getTransactionWithCategory,
  transactions,
} from "../data/mockData";

const router = Router();

// GET /api/transactions/monthly-totals
router.get("/monthly-totals", (req: Request, res: Response) => {
  try {
    const monthlyMap = new Map<string, number>();

    transactions.forEach((transaction) => {
      const date = new Date(transaction.transaction_date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-01`;

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, 0);
      }
      monthlyMap.set(monthKey, monthlyMap.get(monthKey)! + transaction.amount);
    });

    const monthlyTotals = Array.from(monthlyMap.entries())
      .map(([month, total]) => ({
        month,
        total: Math.round(total * 100) / 100,
      }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 12);

    res.json(monthlyTotals);
  } catch (error) {
    console.error("Error fetching monthly totals:", error);
    res.status(500).json({ error: "Failed to fetch monthly totals" });
  }
});

// GET /api/transactions/category-breakdown
router.get("/category-breakdown", (req: Request, res: Response) => {
  try {
    const { startDate, endDate } = req.query;

    let filteredTransactions = transactions;

    if (startDate || endDate) {
      filteredTransactions = transactions.filter((t) => {
        const date = new Date(t.transaction_date);

        if (startDate && date < new Date(startDate as string)) return false;
        if (endDate && date > new Date(endDate as string)) return false;
        return true;
      });
    }

    const breakdownMap = new Map<
      number,
      { name: string; color: string; total: number; count: number }
    >();

    filteredTransactions.forEach((transaction) => {
      const category = categories.find(
        (c) => c.id === transaction.category_id,
      )!;

      if (!breakdownMap.has(transaction.category_id)) {
        breakdownMap.set(transaction.category_id, {
          name: category.name,
          color: category.color,
          total: 0,
          count: 0,
        });
      }

      const entry = breakdownMap.get(transaction.category_id)!;
      entry.total += transaction.amount;
      entry.count += 1;
    });

    const breakdown = Array.from(breakdownMap.entries())
      .map(([category_id, data]) => ({
        category_id,
        category_name: data.name,
        category_color: data.color,
        total: Math.round(data.total * 100) / 100,
        count: data.count,
      }))
      .filter((item) => item.total > 0)
      .sort((a, b) => b.total - a.total);

    res.json(breakdown);
  } catch (error) {
    console.error("Error fetching category breakdown:", error);
    res.status(500).json({ error: "Failed to fetch category breakdown" });
  }
});

// Get paginated transactions /api/transactions
router.get("/", (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const categoryId = req.query.categoryId
      ? parseInt(req.query.categoryId as string)
      : undefined;
    const sortBy = (req.query.sortBy as string) || "date";
    const sortOrder = (req.query.sortOrder as string) || "desc";

    // Filter transactions
    let filtered = transactions.filter((t) => {
      if (startDate && t.transaction_date < startDate) return false;
      if (endDate && t.transaction_date > endDate) return false;
      if (categoryId && t.category_id !== categoryId) return false;
      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (sortBy) {
        case "amount":
          aVal = a.amount;
          bVal = b.amount;
          break;
        case "created_at":
          aVal = new Date(a.created_at).getTime();
          bVal = new Date(b.created_at).getTime();
          break;
        default: //date
          aVal = new Date(a.transaction_date).getTime();
          bVal = new Date(b.transaction_date).getTime();
          break;
      }

      return sortOrder === "asc" ? aVal - bVal : bVal - aVal;
    });

    // Paginate
    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const paginated = filtered.slice(start, end);

    const result = {
      data: paginated.map(getTransactionWithCategory),
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

export default router;
