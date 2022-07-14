import { expect, util, Assertion } from "chai";

declare global {
  export namespace Chai {
    interface Assertion {
      role(str: string | string[]): Assertion;
      name(str: string): Assertion;
    }
  }
}

util.addChainableMethod(
  Assertion.prototype,
  "role",
  function (this: any, str: string | string[]) {
    var obj = util.flag(this, "object");

    if (Array.isArray(str)) {
      if (obj && "role" in obj) {
        new Assertion(obj.role).to.be.oneOf(str);
      } else if (obj && "spoken" in obj) {
        new Assertion(obj.spoken.toLowerCase()).to.contain.oneOf(str);
      } else {
        new Assertion(obj).to.have.any.keys("role", "spoken");
      }
      return;
    }

    if (obj && "role" in obj) {
      new Assertion(obj.role).to.be.equal(str);
    } else if (obj && "spoken" in obj) {
      new Assertion(obj.spoken.toLowerCase()).to.contain(str);
    } else {
      new Assertion(obj).to.have.any.keys("role", "spoken");
    }
  }
);

util.addChainableMethod(
  Assertion.prototype,
  "name",
  function (this: any, str: string) {
    var obj = util.flag(this, "object");

    if (obj && "name" in obj) {
      new Assertion(obj.name).to.be.equal(str);
    } else if (obj && "spoken" in obj) {
      new Assertion(obj.spoken).to.contain(str);
    } else {
      new Assertion(obj).to.have.any.keys("name", "spoken");
    }
  }
);

export { expect };
