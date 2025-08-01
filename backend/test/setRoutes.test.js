import request from "supertest";
import app from "../server.js";
import User from "../models/userModel.js";
import Set from "../models/setModel.js";
import mongoose from "mongoose";

let token;
let userId;
let setId;

beforeEach(async () => {
  const user = await User.create({
    name: "Set Tester",
    email: "set@test.com",
    password: "123456",
  });

  userId = user._id;

  const res = await request(app).post("/api/users/login").send({
    email: "set@test.com",
    password: "123456",
  });

  token = res.headers["set-cookie"][0].split(";")[0];

  const set = await Set.create({
    user: userId,
    name: "Animals",
    description: "Animal vocabulary",
    sourceLanguage: { name: "English", flag: "🇬🇧" },
    targetLanguage: { name: "Polish", flag: "🇵🇱" },
  });

  setId = set._id;
});

afterEach(async () => {
  await User.deleteMany();
  await Set.deleteMany();
});

describe("POST /api/sets", () => {
  it("should create a new set", async () => {
    const res = await request(app)
      .post("/api/sets")
      .set("Cookie", token)
      .send({
        name: "Fruits",
        description: "Fruit vocabulary",
        sourceLanguage: { name: "English", flag: "🇬🇧" },
        targetLanguage: { name: "Polish", flag: "🇵🇱" },
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.name).toBe("Fruits");
  });

  it("should not create duplicate set", async () => {
    const res = await request(app)
      .post("/api/sets")
      .set("Cookie", token)
      .send({
        name: "Animals",
        description: "Animal vocabulary",
        sourceLanguage: { name: "English", flag: "🇬🇧" },
        targetLanguage: { name: "Polish", flag: "🇵🇱" },
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Set already exists");
  });
});

describe("GET /api/sets", () => {
  it("should return all sets for the user", async () => {
    const res = await request(app).get("/api/sets").set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });
});

describe("GET /api/sets/:id", () => {
  it("should return a set by ID", async () => {
    const res = await request(app)
      .get(`/api/sets/${setId}`)
      .set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Animals");
  });

  it("should return 404 for non-existent set", async () => {
    const res = await request(app)
      .get(`/api/sets/${new mongoose.Types.ObjectId()}`)
      .set("Cookie", token);

    expect(res.statusCode).toBe(404);
  });
});

describe("PUT /api/sets/:id", () => {
  it("should update a set", async () => {
    const res = await request(app)
      .put(`/api/sets/${setId}`)
      .set("Cookie", token)
      .send({ name: "Updated Animals" });

    expect(res.statusCode).toBe(200);
    expect(res.body.name).toBe("Updated Animals");
  });
});

describe("DELETE /api/sets/:id", () => {
  it("should delete a set", async () => {
    const res = await request(app)
      .delete(`/api/sets/${setId}`)
      .set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Set and associated flashcards deleted");
  });

  it("should return 404 for non-existent set", async () => {
    const res = await request(app)
      .delete(`/api/sets/${new mongoose.Types.ObjectId()}`)
      .set("Cookie", token);

    expect(res.statusCode).toBe(404);
  });
});
