const request = require("supertest"); // ไลบรารีสำหรับทดสอบ HTTP requests
const app = require("../path_to_your_app"); // เส้นทางของไฟล์แอปพลิเคชันของคุณ

describe("Integration Test - API Endpoints", () => {
  test("GET /api/users - should return all users", async () => {
    const response = await request(app).get("/api/users");
    expect(response.status).toBe(200);
    expect(response.body).toBeDefined();
    expect(Array.isArray(response.body)).toBe(true); // คาดหวังว่า response จะเป็น array
  });

  test("POST /api/users - should create a new user", async () => {
    const newUser = {
      name: "John Doe",
      email: "john.doe@example.com",
    };

    const response = await request(app).post("/api/users").send(newUser);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("id");
    expect(response.body.name).toBe(newUser.name);
  });
});
