import Transaction from "../models/Transaction.js";

export const CATEGORIES = [
  "Food",
  "Transport",
  "Entertainment",
  "Bills",
  "Shopping",
  "Health",
  "Other",
];

const hasOpenAIKey = () => {
  const key = process.env.OPENAI_API_KEY;
  return key && key !== "your_openai_key" && key !== "your_openai_api_key_here" && key.startsWith("sk-");
};

export const normalizeCategory = (raw) => {
  if (!raw) return "Other";
  const cleaned = String(raw).trim().replace(/['".]/g, "");
  const match = CATEGORIES.find(
    (c) => c.toLowerCase() === cleaned.toLowerCase()
  );
  if (match) return match;
  const partial = CATEGORIES.find((c) =>
    cleaned.toLowerCase().includes(c.toLowerCase())
  );
  return partial || "Other";
};

const KEYWORD_RULES = [
  { category: "Food", patterns: /food|restaurant|grocery|grocer|café|cafe|coffee|pizza|burger|dining|swiggy|zomato|doordash|grubhub|starbucks|mcdonald|kfc|subway|domino|bistro|bakery|eat|kitchen|dhaba|chai/i },
  { category: "Transport", patterns: /uber|ola|lyft|taxi|cab|fuel|petrol|gas|diesel|metro|bus|train|rail|parking|toll|transport|auto\s*rickshaw|rapido|irctc|airline|flight/i },
  { category: "Entertainment", patterns: /netflix|spotify|prime|disney|hotstar|movie|cinema|theatre|theater|game|gaming|concert|entertainment|youtube|music|hulu|xbox|playstation/i },
  { category: "Bills", patterns: /bill|electric|electricity|water|gas\s*bill|rent|mortgage|internet|broadband|wifi|phone|mobile\s*recharge|insurance|utility|emi|loan|subscription|dues/i },
  { category: "Shopping", patterns: /amazon|flipkart|myntra|ajio|meesho|shop|store|mall|purchase|retail|clothing|fashion|electronics|market|mart|ikea|target|walmart/i },
  { category: "Health", patterns: /pharmacy|chemist|hospital|clinic|doctor|medical|medicine|health|gym|fitness|dental|apollo|practo|1mg|netmeds|wellness|yoga/i },
];

export const heuristicCategorize = (merchantName, amount = 0) => {
  const text = `${merchantName || ""}`.toLowerCase();

  if (!text.trim()) {
    return amount > 5000 ? "Bills" : "Other";
  }

  for (const { category, patterns } of KEYWORD_RULES) {
    if (patterns.test(text)) return category;
  }

  return "Other";
};

export const openaiCategorize = async (merchantName, amount = 0) => {
  const { default: OpenAI } = await import("openai");
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `Classify this transaction into exactly ONE category from this list only:
Food, Transport, Entertainment, Bills, Shopping, Health, Other

Merchant/description: "${merchantName}"
Amount (INR): ${amount}

Reply with ONLY the category name, nothing else.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.1,
    max_tokens: 20,
  });

  const raw = response.choices[0]?.message?.content?.trim();
  return normalizeCategory(raw);
};

export const categorizeMerchant = async (merchantName, amount = 0) => {
  const name = (merchantName || "").trim();

  if (!name) {
    return { category: "Other", provider: "heuristic" };
  }

  if (hasOpenAIKey()) {
    try {
      const category = await openaiCategorize(name, amount);
      return { category, provider: "openai" };
    } catch {
      // fall through
    }
  }

  return {
    category: heuristicCategorize(name, amount),
    provider: "heuristic",
  };
};

export const batchCategorizeUserTransactions = async (userId) => {
  const transactions = await Transaction.find({ userId });

  let updated = 0;
  const results = [];

  for (const tx of transactions) {
    const merchantName = tx.title || tx.description || "";
    const { category, provider } = await categorizeMerchant(merchantName, tx.amount || 0);

    if (tx.category !== category) {
      tx.category = category;
      await tx.save();
      updated += 1;
    }

    results.push({
      id: tx._id,
      title: tx.title,
      category,
      provider,
    });
  }

  return {
    updated,
    total: transactions.length,
    transactions: results,
  };
};
