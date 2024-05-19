import sinon from "sinon";
import { expect } from "chai";
import mongoose from "mongoose";

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
      expect(err.message).to.equal("Not authenticated!");
      expect(err.code).to.equal(401);
    }
  });

  it("should throw an error if post input is invalid", async () => {
    const args = {
      postInput: { title: "test title", content: "test content" },
    };
    const req = { isAuth: true, userId: new mongoose.Types.ObjectId() };
    const createPostStub = sandbox.stub(resolvers, "createPost").resolves({
      _id: "post123",
      ...args.postInput,
    });

    try {
      await createPostStub(args, req);
    } catch (err) {
      expect(err.message).to.equal("Invalid input.");
      expect(err.code).to.equal(422);
      expect(err.data).to.be.an("array").that.has.lengthOf(2);
      expect(err.data[0]).to.equal("Title is invalid.");
      expect(err.data[1]).to.equal("Content is invalid");
    }
  });

  it("should throw an error if user is invalid", async () => {
    const req = { isAuth: true, userId: new mongoose.Types.ObjectId() };
    const args = {
      postInput: {
        title: "test title",
        content: "test content",
      },
    };
    sandbox.stub(User, "findById").resolves(null);

    try {
      await resolvers.createPost(args, req);
    } catch (err) {
      expect(err.message).to.equal("Invalid user.");
      expect(err.code).to.equal(401);
    }
  });
});
