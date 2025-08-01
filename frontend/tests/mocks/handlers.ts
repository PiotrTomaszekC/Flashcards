import { delay, http, HttpResponse } from "msw";

interface LoginRequestBody {
  email: string;
  password: string;
}

interface RegisterRequestBody {
  name: string;
  email: string;
  password: string;
}

interface UpdateDailyGoalBody {
  dailyGoal: number;
}

interface CreateFlashcardBody {
  set: string;
  word: string;
  translation: string;
  remember: boolean;
}

interface UpdateUserBody {
  name: string;
  email: string;
  password: string;
}

interface CreateDeckBody {
  name: string;
  description: string;
  sourceLanguage: string;
  targetLanguage: string;
}

export const handlers = [
  http.post("/api/users/login", async ({ request }) => {
    const { email, password } = (await request.json()) as LoginRequestBody;

    if (email === "user@example.com" && password === "123456") {
      await delay(400);
      return HttpResponse.json({ email, name: "Test User" });
    }

    await delay(400);
    return HttpResponse.json(
      { message: "Invalid credentials" },
      { status: 401 }
    );
  }),

  http.post("/api/users", async ({ request }) => {
    const { name, email, password } =
      (await request.json()) as RegisterRequestBody;

    await delay(400);

    if (!name || !email || !password) {
      return HttpResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    if (email === "taken@example.com") {
      return HttpResponse.json(
        { message: "Email already in use" },
        { status: 409 }
      );
    }

    return HttpResponse.json({ email, name: "Test User" });
  }),

  http.get("/api/users/profile", async () => {
    await delay(400);

    const testUserId = globalThis.__TEST_USER_ID__ || "1";

    if (testUserId === "1") {
      return HttpResponse.json({
        _id: "1",
        name: "Test User",
        email: "user@example.com",
        recentDecks: ["deck1", "deck2", "deck3"],
      });
    }

    if (testUserId === "2") {
      return HttpResponse.json({
        _id: "2",
        name: "Another User",
        email: "another@example.com",
        recentDecks: [],
      });
    }

    return HttpResponse.json({ message: "User not found" }, { status: 404 });
  }),

  http.get("/api/sets", async () => {
    await delay(400);

    const testUserId = globalThis.__TEST_USER_ID__ || "1";

    if (testUserId === "1") {
      return HttpResponse.json([
        {
          _id: "deck1",
          name: "Spanish Basics",
          sourceLanguage: { name: "English" },
          targetLanguage: { name: "Spanish" },
        },
        {
          _id: "deck2",
          name: "French Travel",
          sourceLanguage: { name: "English" },
          targetLanguage: { name: "French" },
        },
        {
          _id: "deck3",
          name: "German Grammar",
          sourceLanguage: { name: "English" },
          targetLanguage: { name: "German" },
        },
      ]);
    }

    if (testUserId === "2") {
      return HttpResponse.json([]);
    }

    return HttpResponse.json({ message: "User not found" }, { status: 404 });
  }),

  http.get("/api/flashcards", async () => {
    await delay(400);
    const testUserId = globalThis.__TEST_USER_ID__;

    if (testUserId === "1") {
      return HttpResponse.json([
        { _id: "card1", remember: true, repetitions: 3 },
        { _id: "card2", remember: false, repetitions: 1 },
        { _id: "card3", remember: true, repetitions: 2 },
        { _id: "card4", remember: false, repetitions: 0 },
      ]);
    }

    if (testUserId === "2") {
      return HttpResponse.json([]);
    }

    return HttpResponse.json({ message: "User not found" }, { status: 404 });
  }),

  http.get("/api/studyStats", async () => {
    await delay(400);
    const testUserId = globalThis.__TEST_USER_ID__;
    const today = new Date().toISOString().split("T")[0];

    if (testUserId === "1") {
      return HttpResponse.json({
        dailyGoal: 50,
        studyStreak: 5,
        lastStudied: "2025-07-28T10:00:00Z",
        progress: [
          { date: today, repetitions: 55 },
          { date: "2025-07-28", repetitions: 50 },
        ],
      });
    }

    if (testUserId === "2") {
      return HttpResponse.json({
        dailyGoal: 20,
        studyStreak: 0,
        lastStudied: null,
        progress: [],
      });
    }

    return HttpResponse.json({ message: "Stats not found" }, { status: 404 });
  }),
  http.put("/api/studyStats", async ({ request }) => {
    const { dailyGoal } = (await request.json()) as UpdateDailyGoalBody;
    return HttpResponse.json({ dailyGoal });
  }),
  http.post("/api/flashcards", async ({ request }) => {
    const { set, word, translation, remember } =
      (await request.json()) as CreateFlashcardBody;
    return HttpResponse.json({ set, word, translation, remember });
  }),
  http.put("/api/users/profile", async ({ request }) => {
    const { name, email, password } = (await request.json()) as UpdateUserBody;
    await delay(400);
    return HttpResponse.json({ name, email, password });
  }),
  http.post("/api/sets", async ({ request }) => {
    const { name, description, sourceLanguage, targetLanguage } =
      (await request.json()) as CreateDeckBody;
    await delay(400);
    return HttpResponse.json({
      name,
      description,
      sourceLanguage,
      targetLanguage,
    });
  }),
  http.delete("/api/sets/deck1", async () => {
    await delay(400);
    return HttpResponse.json({ message: "Deck deleted" });
  }),
  http.put("/api/sets/deck1", async ({ request }) => {
    const { name, description, sourceLanguage, targetLanguage } =
      (await request.json()) as CreateDeckBody;
    await delay(400);
    return HttpResponse.json({
      name,
      description,
      sourceLanguage,
      targetLanguage,
    });
  }),
  http.get("/api/sets/deck1", async () => {
    await delay(400);
    return HttpResponse.json({
      _id: "deck1",
      name: "Spanish Basics",
      description: "Spanish words",
      sourceLanguage: { name: "English" },
      targetLanguage: { name: "Spanish" },
    });
  }),
  http.get("/api/flashcards?setId=deck1", async () => {
    await delay(400);
    return HttpResponse.json([
      {
        _id: "card1",
        set: "set1",
        word: "Dog",
        translation: "Perro",
        remember: true,
        repetitions: 3,
      },
      {
        _id: "card2",
        set: "set1",
        word: "Cat",
        translation: "Gato",
        remember: false,
        repetitions: 1,
      },
      { _id: "card3", remember: true, repetitions: 2 },
      { _id: "card4", remember: false, repetitions: 0 },
    ]);
  }),
];
