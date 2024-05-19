import sinon from "sinon";
import { expect } from "chai";

import { resolvers } from "../graphql/index.js";

import User from "../models/user.js";
import Post from "../models/post.js";

describe("Feed resolver", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should throw an error if not authenticated", async () => {
    const args = {
      postInput: {
        title: "test title",
        content: "test content",
        imageUrl: "test image url",
      },
    };
    const req = { isAuth: false };

    try {
      await resolvers.createPost(args, req);
    } catch (err) {
      expect(err).to.be.an("error");
      expect(err.message).to.equal("Not authenticated!");
      expect(err.code).to.equal(401);
    }
  });
});
