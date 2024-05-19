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

  it("should throw an error if input is invalid", async () => {
    const args = {
      postInput: { title: "test title", content: "test content" },
    };
    const req = { isAuth: true, userId: new mongoose.Types.ObjectId() };
    const createPostStub = sandbox.stub(resolvers, "createPost").resolves({
      _id: "post123",
      ...args.postInput,
    });

    try {
      await resolvers.createPost(args, req);
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

  // it("should create a post and update the user", async () => {
  //   const req = { isAuth: true, userId: "user123" };
  //   const args = {
  //     postInput: {
  //       title: "test title",
  //       content: "test content",
  //     },
  //   };
  //   const user = { _id: "user123", posts: [], save: sandbox.stub().resolves() };
  //   const post = {
  //     save: sandbox.stub().resolves({
  //       _id: "post123",
  //       title: "test title",
  //       content: "test content",
  //       imageUrl: "http://test.com/test.jpg",
  //     }),
  //   };
  //   sandbox.stub(User, "findById").resolves(user);
  //   sandbox.stub(Post.prototype, "save").returns(post.save());

  //   const result = await resolvers.createPost(args, req);

  //   expect(result).to.have.keys([
  //     "_id",
  //     "title",
  //     "content",
  //     "imageUrl",
  //     "creator",
  //     "createdAt",
  //     "updatedAt",
  //   ]);
  //   expect(result.title).to.equal("Test Title");
  //   expect(result.content).to.equal("Test Content");
  //   expect(result.imageUrl).to.equal("http://test.com/image.jpg");
  //   expect(user.posts).to.have.lengthOf(1);
  //   expect(user.posts[0]._id.toString()).to.equal("post123");
  //   expect(user.save).to.have.been.calledOnce;
  // });
});
