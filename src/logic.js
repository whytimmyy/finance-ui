

export const initialData = [
  { id: 1, date: "2026-04-01", amount: 5000, category: "Salary", type: "income" },
  { id: 2, date: "2026-04-02", amount: 200, category: "Food", type: "expense" },
  { id: 3, date: "2026-04-03", amount: 1000, category: "Freelance", type: "income" },
  { id: 4, date: "2026-04-04", amount: 300, category: "Shopping", type: "expense" },
];

export const calculateSummary = (transactions) => {
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, t) => acc + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
  };
};


export const filterTransactions = (transactions, filter) => {
  if (filter === "all") return transactions;
  return transactions.filter((t) => t.type === filter);
};


export const createTransaction = () => {
  return {
    id: Date.now(),
    date: "2026-04-05",
    amount: 150,
    category: "Misc",
    type: "expense",
  };
};

export const getHighestSpendingCategory = (transactions) => {
  const categoryMap = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      if (!categoryMap[t.category]) {
        categoryMap[t.category] = 0;
      }
      categoryMap[t.category] += Number(t.amount);
    }
  });

  let maxCategory = "None";
  let maxAmount = 0;

  for (let category in categoryMap) {
    if (categoryMap[category] > maxAmount) {
      maxAmount = categoryMap[category];
      maxCategory = category;
    }
  }

  return { maxCategory, maxAmount };
};
export const getMonthlyComparison = (transactions) => {
  let income = 0;
  let expenses = 0;

  transactions.forEach((t) => {
    const month = t.date.slice(0, 7); // "YYYY-MM"

    // For simplicity: only current month (latest data)
    const currentMonth = new Date().toISOString().slice(0, 7);

    if (month === currentMonth) {
      if (t.type === "income") income += Number(t.amount);
      else expenses += Number(t.amount);
    }
  });

  return { income, expenses };
};

export const getCategoryData = (transactions) => {
  const map = {};

  transactions.forEach((t) => {
    if (t.type === "expense") {
      if (!map[t.category]) {
        map[t.category] = 0;
      }
      map[t.category] += Number(t.amount);
    }
  });

  return Object.keys(map).map((key) => ({
    name: key,
    value: map[key],
  }));
};