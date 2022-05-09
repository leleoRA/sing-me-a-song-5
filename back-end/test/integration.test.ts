import supertest from "supertest";
import app from "../src/app.js";
import recommendationFactory from "./factories/recommendationFactory.js";
import { prisma } from "../src/database.js";
import { recommendationRepository } from "../src/repositories/recommendationRepository.js";

const agent = supertest(app);

describe("App integration tests", () => {
    beforeEach(async () => {
        await prisma.$queryRaw`TRUNCATE TABLE recommendations`;
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });


describe("POST /recommendations", () => {
  it("should give status 201 with valid body",
    async () => {
      const recommendation = recommendationFactory.recommendationBody();
      const response = await agent.post("/recommendations").send({
        name: recommendation.name,
        youtubeLink: recommendation.youtubeLink,
      });
      expect(response.status).toBe(201);
      expect(recommendation).not.toEqual(null);
    });
  it("should give status 422 given invalid body", async () => {
    const response = await supertest(app).post("/recommendations").send({});
    expect(response.status).toEqual(422);
  });
})
describe("/POST /recommendation:id/:action",  () => {
  it("should give a upvote in a recommendation", async () => {

    const id = await recommendationFactory.insert();

    const response = await agent.post(`/recommendations/${id}/upvote`);

    const score = await recommendationFactory.findUniqueById(id);

    expect(response.status).toEqual(200);
    expect(score).toEqual(1);
  })
  it("should give a downvote in a recommendation", async () => {

    const id = await recommendationFactory.insert();

    const response = await agent.post(`/recommendations/${id}/downvote`);

    const score = await recommendationFactory.findUniqueById(id);

    expect(response.status).toEqual(200);
    expect(score).toEqual(-1);
  })
  it("should delete the recommendation after score less than -5", async () => {
    const id = await recommendationFactory.insert();

    for (let i = 0; i <= 5; i++) {
      await supertest(app).post(`/recommendations/${id}/downvote`);
    }

    const recommendation = await recommendationFactory.findUniqueById(id);

    expect(recommendation).toEqual(null);
  });
})

describe("/GET, /recommendations", () => {
  it('should return 10 recommendations', async () => {
    await recommendationFactory.insertMany(10);

    const response = await agent.get("/recommendations");

    expect(response.body.length).toEqual(10)
  })
  it('should return last 10 recommendations', async () => {
    await recommendationFactory.insertMany(5);

    const response = await agent.get("/recommendations");

    expect(response.body).toBeTruthy()
  })
})
describe("/GET, /recommendations/:id", () => {
  it('should return recommendation by id', async () => {
    const id = await recommendationFactory.insert();
    
    const response = await agent.get(`/recommendations/${id}`);
    
    expect(response.body).toHaveProperty("name")
    expect(response.body.id).toEqual(id)
  })
})
describe("/GET, /recommendations/random", () => {
  it("should return status code 404 with no recommendations", async () => {
    const response = await supertest(app).get("/recommendations/random");
    expect(response.status).toEqual(404);
  });
  it('should return a random recommendation', async () => {
    await recommendationFactory.insertMany(10);
    const firstRecommendation = await agent.get(`/recommendations/random`);
    const secondRecommendation = await agent.get(`/recommendations/random`);
    expect(firstRecommendation.body).toHaveProperty("name")
    expect(secondRecommendation.body).toHaveProperty("name")
    
  })
})
describe("GET /recommendations/top/:amount", () => {
        it("should return top recommendations", async () => {
            const amount = 5
            await recommendationFactory.insertMany(10)
            const response = await supertest(app).get(
                `/recommendations/top/${amount}`
            );

            expect(response.body.length).toEqual(amount);
            expect(response.body[0].score).toBeGreaterThanOrEqual(response.body[1].score);
        });
})
})
