import request from "supertest";
import app from "../server.js";
import User from "../models/userModel.js";
import mongoose from "mongoose";

let token;

beforeEach(async () => {
  const user = await User.create({
    name: "Test User",
    email: "test@example.com",
    password: "123456",
  });

  const res = await request(app).post("/api/users/login").send({
    email: "test@example.com",
    password: "123456",
  });

  token = res.headers["set-cookie"][0].split(";")[0]; // extract jwt cookie
});

afterEach(async () => {
  await User.deleteMany();
});

describe("POST /api/users", () => {
  it("should register a new user", async () => {
    const res = await request(app).post("/api/users").send({
      name: "New User",
      email: "new@example.com",
      password: "password",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.email).toBe("new@example.com");
  });

  it("should not register with existing email", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Test User",
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("User already exists");
  });
});

describe("POST /api/users/login", () => {
  it("should login with correct credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "123456",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
  });

  it("should reject invalid credentials", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "test@example.com",
      password: "wrongpassword",
    });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid email or password");
  });
});

describe("GET /api/users/profile", () => {
  it("should return user profile when authenticated", async () => {
    const res = await request(app)
      .get("/api/users/profile")
      .set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe("test@example.com");
  });

  it("should reject unauthenticated request", async () => {
    const res = await request(app).get("/api/users/profile");
    expect(res.statusCode).toBe(401);
  });
});
