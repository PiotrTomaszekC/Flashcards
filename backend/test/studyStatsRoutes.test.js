import request from "supertest";
import app from "../server.js";
import User from "../models/userModel.js";
import StudyStats from "../models/studyStatsModel.js";

let token;
let userId;

beforeEach(async () => {
  // Clean up all users and stats
  await StudyStats.deleteMany();
  await User.deleteMany();

  // Create a new user
  const user = await User.create({
    name: "Study Tester",
    email: "study@test.com",
    password: "123456",
  });

  userId = user._id;

  // Log in to get token
  const res = await request(app).post("/api/users/login").send({
    email: "study@test.com",
    password: "123456",
  });

  token = res.headers["set-cookie"][0].split(";")[0];

  // Ensure no duplicate stats
  await StudyStats.deleteMany({ user: userId });

  // Create fresh study stats
  await StudyStats.create({
    user: userId,
    dailyGoal: 2,
    progress: [],
    studyStreak: 0,
    lastStudyDate: null,
  });
});

afterEach(async () => {
  await User.deleteMany();
  await StudyStats.deleteMany();
});

describe("GET /api/studyStats", () => {
  it("should return study stats for the user", async () => {
    const res = await request(app).get("/api/studyStats").set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.dailyGoal).toBe(2);
  });
});

describe("PUT /api/studyStats", () => {
  it("should update the daily goal", async () => {
    const res = await request(app)
      .put("/api/studyStats")
      .set("Cookie", token)
      .send({ dailyGoal: 5 });

    expect(res.statusCode).toBe(200);
    expect(res.body.dailyGoal).toBe(5);
  });
});

describe("POST /api/studyStats", () => {
  it("should add progress and update streak", async () => {
    // First repetition
    await request(app).post("/api/studyStats").set("Cookie", token);
    // Second repetition (meets goal)
    const res = await request(app).post("/api/studyStats").set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.progress[0].repetitions).toBe(2);
    expect(res.body.studyStreak).toBe(1);
    expect(res.body.progress[0].streakUpdated).toBe(true);
  });

  it("should not increment streak again on same day", async () => {
    // Simulate meeting goal
    await request(app).post("/api/studyStats").set("Cookie", token);
    await request(app).post("/api/studyStats").set("Cookie", token);
    // Third repetition (should not increase streak again)
    const res = await request(app).post("/api/studyStats").set("Cookie", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.studyStreak).toBe(1);
    expect(res.body.progress[0].repetitions).toBe(3);
  });
});
