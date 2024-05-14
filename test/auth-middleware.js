import { expect } from "chai";

import authMiddleware from "../middlewares/auth.js";

it("should throw an error if no authorization file is present", function () {
  const req = {
    get: function (headerName) {
      return null;
    },
  };
  const next = () => {};
  authMiddleware(req, {}, next);

  expect(req).to.have.property("isAuth", false);
});

it("should throw an error if the authorization header is only one string", function () {
  const req = {
    get: function (headerName) {
      return "Bearer";
    },
  };
  const next = () => {};
  expect(authMiddleware.bind(this, req, {}, next)).to.throw();
});
