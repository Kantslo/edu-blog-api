import { expect } from "chai";

import authMiddleware from "../middlewares/auth.js";

it("should throw an error if no authorization file is present", function () {
  const req = {
    get: function () {
      return null;
    },
  };
  const next = () => {};
  authMiddleware(req, {}, next);

  expect(req).to.have.property("isAuth", false);
});
