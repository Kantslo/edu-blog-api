import { expect } from "chai";
import jwt from "jsonwebtoken";
import sinon from "sinon";

import authMiddleware from "../middlewares/auth.js";

describe("Auth middleware", function () {
  it("should throw an error if no authorization file is present", function () {
    const req = {
      get: function (headerName) {
        return null;
      },
    };
    authMiddleware(req, {}, () => {});

    expect(req).to.have.property("isAuth", false);
  });

  it("should throw an error if the authorization header is only one string", function () {
    const req = {
      get: function (headerName) {
        return "xyz";
      },
    };
    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", function () {
    const req = {
      get: function (headerName) {
        return "Bearer xyz";
      },
    };
    authMiddleware(req, {}, () => {});

    expect(req).to.have.property("isAuth", false);
  });

  it("should yield a userId after decoding the token", function () {
    const req = {
      get: function (headerName) {
        return "Bearer hljaevwuelwjeri";
      },
    };
    sinon.stub(jwt, "verify");

    jwt.verify.returns({ userId: "abc" });
    authMiddleware(req, {}, () => {});

    expect(req).to.have.property("userId");
    expect(req).to.have.property("userId", "abc");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
