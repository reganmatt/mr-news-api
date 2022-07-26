const request = require("supertest");
const app = require("../app");
const connection = require("../db/connection");
const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");

beforeEach(() => seed(testData));
afterAll(() => {
  connection.end();
});

describe("GET: /api/topics", () => {
  test("200: responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          topics: [
            { slug: "mitch", description: "The man, the Mitch, the legend" },
            { slug: "cats", description: "Not dogs" },
            { slug: "paper", description: "what books are made of" },
          ],
        });
      });
  });
  test("404: returns a 404 with message if passed wrong request", () => {
    return request(app)
      .get("/api/bad_path")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("path not found");
      });
  });
});

describe("GET: /api/articles/:article_id", () => {
  test("200: responds with labelled requested article object, with comment count", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article: {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 100,
            comment_count: "11",
          },
        });
      });
  });
  test("404: returns a 404 with message if passed wrong request", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article not found");
      });
  });
  test("422: returns a 422 with message if passed wrong datatype", () => {
    return request(app)
      .get("/api/articles/hello")
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe("unprocessable entity");
      });
  });
});

describe("PATCH: /api/articles/:article_id", () => {
  test("200: responds with requested article that has appropriately updated votes value", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 5 })
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          article: {
            article_id: 1,
            title: "Living in the shadow of a great man",
            topic: "mitch",
            author: "butter_bridge",
            body: "I find this existence challenging",
            created_at: "2020-07-09T20:11:00.000Z",
            votes: 105,
          },
        });
      });
  });
  test("422: returns a 422 with message if passed wrong vote datatype", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "hello" })
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe("unprocessable entity");
      });
  });
  test("404: returns a 404 with message if passed wrong article id", () => {
    return request(app)
      .get("/api/articles/999")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article not found");
      });
  });
});

describe("GET: /api/users", () => {
  test("200: responds with array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body).toEqual({
          users: [
            {
              username: "butter_bridge",
              name: "jonny",
              avatar_url:
                "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
            },
            {
              username: "icellusedkars",
              name: "sam",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24604688?s=460&v=4",
            },
            {
              username: "rogersop",
              name: "paul",
              avatar_url:
                "https://avatars2.githubusercontent.com/u/24394918?s=400&v=4",
            },
            {
              username: "lurker",
              name: "do_nothing",
              avatar_url:
                "https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
            },
          ],
        });
      });
  });
});

describe("GET: /api/articles", () => {
  test("200: returns with array of article objects, with comment_count, and sorted by date desc", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        // expect(body.articles).toHaveLength(12);
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
        body.articles.forEach((article) => {
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(Number),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns an array of specified article's comments", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect.objectContaining({
            comment_id: expect.any(Number),
            article_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(Number),
            author: expect.any(String),
            body: expect.any(String),
          });
        });
      });
  });
  test("404: returns a 404 with message if passed invalid article id", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article not found");
      });
  });
  test("422: returns a 422 with message if passed article_id datatype", () => {
    return request(app)
      .get("/api/articles/hello/comments")
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe("unprocessable entity");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: adds and returns new comment with user and body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({
        username: "butter_bridge",
        body: "This is the new comment's body",
      })
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 19,
            article_id: 1,
            author: "butter_bridge",
            body: "This is the new comment's body",
            votes: 0,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("400: returns a 400 with message if passed missing data", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: null, body: null })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("bad request, missing fields");
      });
  });
  test("404: returns a 404 if article not found", () => {
    return request(app)
      .get("/api/articles/999/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("article not found");
      });
  });
});

describe("GET: /api/articles (queries)", () => {
  test("200: accepts sort_by which sorts by which defaults to date", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("200: accepts sort_by which sorts by specified column", () => {
    return request(app)
      .get("/api/articles?sort_by=title")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", {
          descending: true,
        });
      });
  });
  test("200: accepts asc or desc options which sort accordingly", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("title", {
          descending: false,
        });
      });
  });
  test("200: accepts topic option which returns relevant articles with relevant topics", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc&topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
        expect.objectContaining({
          title: "UNCOVERED: catspiracy to bring down democracy",
          topic: "cats",
          author: "rogersop",
          body: "Bastet walks amongst us, and the cats are taking arms!",
          created_at: 1596464040000,
          votes: 0,
        });
      });
  });
  test("422: returns a 422 if passed bad sort_by", () => {
    return request(app)
      .get("/api/articles/sort_by=hello")
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe("unprocessable entity");
      });
  });
  test("422: returns a 422 if passed bad order", () => {
    return request(app)
      .get("/api/articles/sort_by=title&order=hello")
      .expect(422)
      .then(({ body }) => {
        expect(body.message).toBe("unprocessable entity");
      });
  });
  // test("404: returns a 404 if topic not found", () => {
  //   return request(app)
  //     .get("/api/articles?sort_by=title&order=asc&topic=hello")
  //     .expect(404)
  //     .then(({ body }) => {
  //       expect(body.message).toBe("article not found");
  //     });
  // });
  test("200: returns a 200 if topic exists, but no articles", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc&topic=paper")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
});
