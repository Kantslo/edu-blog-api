import bcrypt from "bcrypt";
import validator from "validator";
import jwt from "jsonwebtoken";
import { expect } from "chai";
import sinon from "sinon";

import { resolvers } from "../graphql/index.js";
import User from "../models/user.js";

describe("Login Resolver", () => {
  let findOneStub;
  let compareStub;
  let signStub;

  beforeEach(() => {
    findOneStub = sinon.stub(User, "findOne");
    compareStub = sinon.stub(bcrypt, "compare");
    signStub = sinon.stub(jwt, "sign");
  });

  afterEach(() => {
    findOneStub.restore();
    compareStub.restore();
    signStub.restore();
  });

  it("should return a token and userId for valid credentials", async () => {
    const email = "test@example.com";
    const password = "validPassword";
    const userId = "1234567890";
    const hashedPassword = await bcrypt.hash(password, 12);

    findOneStub
      .withArgs({ email })
      .resolves({ _id: userId, email, password: hashedPassword });
    compareStub.withArgs(password, hashedPassword).resolves(true);
    signStub.returns("dummy_token");

    const result = await resolvers.login({ email, password }, {});

    expect(findOneStub.calledWith({ email })).to.be.true;
    expect(compareStub.calledWith(password, hashedPassword)).to.be.true;
    expect(signStub.calledOnce).to.be.true;
    expect(result).to.have.property("token", "dummy_token");
    expect(result).to.have.property("userId", userId);
  });

  it("should throw an error if user is not found", async () => {
    findOneStub.withArgs({ email: "nonexistent@example.com" }).resolves(null);

    try {
      await resolvers.login(
        { email: "nonexistent@example.com", password: "password" },
        {}
      );
    } catch (error) {
      expect(error.message).to.equal("User not found.");
      expect(error.code).to.equal(401);
    }
  });

  it("should throw an error if password is incorrect", async () => {
    findOneStub.withArgs({ email: "test@example.com" }).resolves({
      _id: "123",
      email: "test@example.com",
      password: await bcrypt.hash("validPassword", 12),
    });
    compareStub.resolves(false);

    try {
      await resolvers.login(
        { email: "test@example.com", password: "incorrectPassword" },
        {}
      );
    } catch (error) {
      expect(error.message).to.equal("Password is incorrect.");
      expect(error.code).to.equal(401);
    }
  });
});

describe("createUser resolver", () => {
  let sandbox;

  beforeEach(() => {
    sandbox = sinon.createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it("should create a new user with valid input", async () => {
    const userInput = {
      email: "test@example.com",
      name: "John Doe",
      password: "password123",
    };

    const isEmailStub = sandbox.stub(validator, "isEmail").returns(true);
    const isLengthStub = sandbox.stub(validator, "isLength").returns(true);
    const hashStub = sandbox.stub(bcrypt, "hash").resolves("hashedPassword");
    const saveStub = sandbox.stub(User.prototype, "save").resolves({
      _doc: { ...userInput, password: "hashedPassword" },
      _id: "1234567890",
    });

    const findOneStub = sandbox.stub(User, "findOne").resolves(null);

    try {
      const result = await resolvers.createUser(
        { userInput },
        { isAuth: true }
      );
      expect(result).to.have.property("email", userInput.email);
      expect(result).to.have.property("name", userInput.name);
      expect(result).to.have.property("_id", "1234567890");
    } catch (error) {
      throw error;
    }

    expect(isEmailStub.calledWith(userInput.email)).to.be.true;
    expect(isLengthStub.calledWith(userInput.password, { min: 5 })).to.be.true;
    expect(hashStub.calledWith(userInput.password, 12)).to.be.true;
    expect(saveStub.calledOnce).to.be.true;
    expect(findOneStub.calledOnce).to.be.true;
  });
});
