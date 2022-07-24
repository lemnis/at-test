import { expect, util, Assertion } from "chai";

declare global {
  export namespace Chai {
    interface Assertion {
      role(str: string | string[]): Assertion;
      name(str: string | string[]): Assertion;
      value(str: string | string[]): Assertion;
      multiline(): Assertion;
      expanded(): Assertion;
      collapsed(): Assertion;
      invalid(): Assertion;
      selected(): Assertion;
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
  "value",
  function (this: any, str: string | string[]) {
    var obj = util.flag(this, "object");

    if (Array.isArray(str)) {
      if (obj && "value" in obj) {
        new Assertion(obj.value).to.be.oneOf(str);
      } else if (obj && "spoken" in obj) {
        new Assertion(obj.spoken.toLowerCase()).to.contain.oneOf(str);
      } else {
        new Assertion(obj).to.have.any.keys("value", "spoken");
      }
      return;
    }

    if (obj && "value" in obj) {
      new Assertion(obj.value).to.be.equal(str);
    } else if (obj && "spoken" in obj) {
      new Assertion(obj.spoken.toLowerCase()).to.contain(str);
    } else {
      new Assertion(obj).to.have.any.keys("value", "spoken");
    }
  }
);

util.addChainableMethod(
  Assertion.prototype,
  "name",
  function (this: any, str: string) {
    var obj = util.flag(this, "object");

    if (Array.isArray(str)) {
      if (obj && "name" in obj) {
        new Assertion(obj.name).to.be.oneOf(str);
      } else if (obj && "spoken" in obj) {
        new Assertion(obj.spoken).to.contain.oneOf(str);
      } else {
        new Assertion(obj).to.have.any.keys("name", "spoken");
      }
      return;
    }

    if (obj && "name" in obj) {
      new Assertion(obj.name).to.be.equal(str);
    } else if (obj && "spoken" in obj) {
      new Assertion(obj.spoken).to.contain(str);
    } else {
      new Assertion(obj).to.have.any.keys("name", "spoken");
    }
  }
);

util.addChainableMethod(Assertion.prototype, "multiline", function (this: any) {
  var obj = util.flag(this, "object");

  if (obj && "multiline" in obj) {
    new Assertion(obj.multiline).to.be.true;
  } else if (obj && "spoken" in obj) {
    new Assertion(obj, "Multiline is optional in output").to.be.ok;
  } else {
    new Assertion(obj).to.have.any.keys("multiline", "spoken");
  }
});

util.addChainableMethod(Assertion.prototype, "expanded", function (this: any) {
  var obj = util.flag(this, "object");

  if (obj && "expanded" in obj) {
    new Assertion(obj.expanded).to.be.true;
  } else if (obj && "spoken" in obj) {
    new Assertion(obj.spoken).to.contain("expanded");
  } else {
    new Assertion(obj).to.have.any.keys("expanded", "spoken");
  }
});

util.addChainableMethod(Assertion.prototype, "collapsed", function (this: any) {
  var obj = util.flag(this, "object");

  if (obj && "expanded" in obj) {
    new Assertion(obj.expanded).to.be.false;
  } else if (obj && "spoken" in obj) {
    new Assertion(obj.spoken).to.contain("collapsed");
  } else {
    new Assertion(obj).to.have.any.keys("expanded", "spoken");
  }
});

util.addChainableMethod(Assertion.prototype, "invalid", function (this: any) {
  var obj = util.flag(this, "object");

  if (obj && "expanded" in obj) {
    new Assertion(obj.invalid).to.be.true;
  } else if (obj && "spoken" in obj) {
    new Assertion(obj.spoken).to.contain("invalid data");
  } else {
    new Assertion(obj).to.have.any.keys("expanded", "spoken");
  }
});

util.addChainableMethod(Assertion.prototype, "selected", function (this: any) {
  var obj = util.flag(this, "object");

  if (util.flag(this, "negate")) {
    if (obj && "expanded" in obj) {
      new Assertion(obj.selected).to.be.false;
    } else if (obj && "spoken" in obj) {
      new Assertion(obj.spoken).to.not.contain("✓");
    }
  } else if (obj && "expanded" in obj) {
    new Assertion(obj.selected).to.be.true;
  } else if (obj && "spoken" in obj) {
    new Assertion(obj.spoken).to.contain("✓");
  } else {
    new Assertion(obj).to.have.any.keys("expanded", "spoken");
  }
});

export { expect };
