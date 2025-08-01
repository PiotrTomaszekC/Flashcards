import request from "supertest";
import app from "../server.js";
import User from "../models/userModel.js";
import Card from "../models/cardModel.js";
import mongoose from "mongoose";
import Set from "../models/setModel.js";

let token;
let userId;
let cardId;
let setId;

beforeEach(async () => {
  const user = await User.create({
    name: "Flashcard Tester",
    email: "flash@test.com",
    password: "123456",
  });

  userId = user._id;

  const res = await request(app).post("/api/users/login").send({
    email: "flash@test.com",
    password: "123456",
  });

  token = res.headers["set-cookie"][0].split(";")[0];

  const set = await Set.create({
    user: userId,
    name: "Test Set",
    sourceLanguage: {
      name: "English",
      flag: "🇬🇧", // or a valid image URL if that's what your app expects
    },
    targetLanguage: {
      name: "Polish",
      flag: "🇵🇱",
    },
  });

  setId = set._id;

  const card = await Card.create({
    user: userId,
    set: setId,
    word: "hello",
    translation: "cześć",
    remember: false,
  });

  cardId = card._id;
});

afterEach(async () => {
  await User.deleteMany();
  await Card.deleteMany();
});

describe("POST /api/flashcards", () => {
  it("should create a new flashcard", async () => {
    const res = await request(app)
      .post("/api/flashcards")
      .set("Cookie", token)
      .send({
        set: setId,
        word: "world",
        translation: "świat",
        remember: false,
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.word).toBe("world");
  });

  it("should not create duplicate flashcard", async () => {
    const res = await request(app)
      .post("/api/flashcards")
      .set("Cookie", token)
      .send({
        set: setId,
        word: "hello",
        translation: "cześć",
        remember: false,
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Card already exists in this set");
  });
});

describe("GET /api/flashcards", () => {
  it("should return all flashcards", async () => {
    const res = await request(app).get("/api/flashcards").set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("should filter flashcards by setId", async () => {
    const res = await request(app)
      .get(`/api/flashcards?setId=${setId}`)
      .set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0].set).toBe(setId.toString()); // ✅ compare ObjectId as string
  });
});

describe("GET /api/flashcards/:id", () => {
  it("should return a flashcard by ID", async () => {
    const res = await request(app)
      .get(`/api/flashcards/${cardId}`)
      .set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.word).toBe("hello");
  });

  it("should return 404 for non-existent flashcard", async () => {
    const res = await request(app)
      .get(`/api/flashcards/${new mongoose.Types.ObjectId()}`)
      .set("Cookie", token);

    expect(res.statusCode).toBe(404);
  });
});

describe("PUT /api/flashcards/:id", () => {
  it("should update flashcard remember status", async () => {
    const res = await request(app)
      .put(`/api/flashcards/${cardId}`)
      .set("Cookie", token)
      .send({ remember: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.remember).toBe(true);
    expect(res.body.repetitions).toBe(1);
    expect(res.body.rememberedCount).toBe(1);
  });
});

describe("DELETE /api/flashcards/:id", () => {
  it("should delete a flashcard", async () => {
    const res = await request(app)
      .delete(`/api/flashcards/${cardId}`)
      .set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Flashcard deleted");
  });

  it("should return 404 for non-existent flashcard", async () => {
    const res = await request(app)
      .delete(`/api/flashcards/${new mongoose.Types.ObjectId()}`)
      .set("Cookie", token);

    expect(res.statusCode).toBe(404);
  });
});
