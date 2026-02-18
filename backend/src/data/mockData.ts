export interface Category {
  id: number;
  name: string;
  color: string;
  icon: null | string;
}

export interface Transaction {
  id: number;
  user_id: number;
  category_id: number;
  amount: number;
  description: null | string;
  transaction_date: string;
  created_at: string;
}

export interface TransactionWithCategory extends Transaction {
  category: Category;
}

export const categories: Category[] = [
  { id: 1, name: "Groceries & Food", color: "#FF7A59", icon: "shopping-bag" },
  { id: 2, name: "Shopping & Retail", color: "#2EC4B6", icon: "shopping-cart" },
  { id: 3, name: "Transport", color: "#5DADE2", icon: "car" },
  { id: 4, name: "Bills & Subscriptions", color: "#F4A261", icon: "file-text" },
  { id: 5, name: "Entertainment & Fun", color: "#9BDEAC", icon: "music" },
  { id: 6, name: "Health & Wellness", color: "#F6C85F", icon: "heart" },
  { id: 7, name: "Travel & Trips", color: "#B39DDB", icon: "airplane" },
  { id: 8, name: "Learning & Growth", color: "#6EC1E4", icon: "book-open" },
  { id: 9, name: "Miscellaneous", color: "#AAB7B8", icon: "dots-horizontal" },
];

// Generate transactions for the last 6 months
function generateTransactions(): Transaction[] {
  const transactions: Transaction[] = [];
  const now = new Date();
  let id = 1;

  for (let monthOffset = 0; monthOffset < 6; monthOffset++) {
    const monthDate = new Date(
      now.getFullYear(),
      now.getMonth() - monthOffset,
      1,
    );
    const daysInMonth = new Date(
      monthDate.getFullYear(),
      monthDate.getMonth() + 1,
      0,
    ).getDate();

    // Generate 8-15 transactions per month
    const numTransactions = Math.floor(Math.random() * 8) + 8;

    for (let i = 0; i < numTransactions; i++) {
      const day = Math.floor(Math.random() * daysInMonth) + 1;
      const transactionDate = new Date(
        monthDate.getFullYear(),
        monthDate.getMonth(),
        day,
      );

      const categoryId = Math.floor(Math.random() * categories.length) + 1;
      const category = categories.find((c) => c.id === categoryId)!;

      // Generate realistic amounts based on category
      let amount = 0;
      switch (categoryId) {
        case 1: // Groceries & Food
          amount = Math.random() * 80 + 15;
          break;
        case 2: // Shopping & Retail
          amount = Math.random() * 200 + 30;
          break;
        case 3: // Transport
          amount = Math.random() * 50 + 10;
          break;
        case 4: // Bills & Subscriptions
          amount = Math.random() * 200 + 100;
          break;
        case 5: // Entertainment & Fun
          amount = Math.random() * 100 + 20;
          break;
        case 6: // Health & Wellness
          amount = Math.random() * 300 + 50;
          break;
        case 7: // Travel & Trips
          amount = Math.random() * 800 + 200;
          break;
        case 8: // Learning & Growth
          amount = Math.random() * 200 + 50;
          break;
        default:
          amount = Math.random() * 150 + 25;
      }

      const descriptions = [
        `${category.name} expense`,
        `Payment for ${category.name.toLowerCase()}`,
        `Monthly ${category.name.toLowerCase()} bill`,
        `Purchase: ${category.name.toLowerCase()}`,
      ];

      transactions.push({
        id: id++,
        user_id: 1,
        category_id: categoryId,
        amount: Math.round(amount * 100) / 100,
        description:
          descriptions[Math.floor(Math.random() * descriptions.length)],
        transaction_date: transactionDate.toISOString().split("T")[0],
        created_at: transactionDate.toISOString(),
      });
    }
  }

  return transactions.sort(
    (a, b) =>
      new Date(b.transaction_date).getTime() -
      new Date(a.transaction_date).getTime(),
  );
}

export const transactions: Transaction[] = generateTransactions();

// Helper to get transaction with category
export function getTransactionWithCategory(
  transaction: Transaction,
): TransactionWithCategory {
  const category = categories.find((c) => c.id === transaction.category_id)!;
  return {
    ...transaction,
    category,
  };
}
