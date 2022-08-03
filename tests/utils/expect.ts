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
      level(level: number): Assertion;
      selected: Assertion;
      disabled: Assertion;
    }
  }
}

function toInclude(property: string, str: string | string[], value: any) {
  if (!(property in value && "spoken" in value)) {
    new Assertion(value).to.have.any.keys(property, "spoken");
  }

  if (Array.isArray(str)) {
    if (property in value) {
      new Assertion(value[property]).to.be.oneOf(str);
    } else if (value.output?.phrases?.length) {
      new Assertion(value.output.phrases.join()).to.contain.oneOf(str);
    } else {
      new Assertion(value.spoken).to.contain.oneOf(str);
    }
  } else if (property in value) {
    new Assertion(value[property]).to.be.equal(str);
  } else if (value.output?.phrases?.length) {
    new Assertion(value.output.phrases.join()).to.contain(str);
  } else {
    new Assertion(value.spoken).to.contain(str);
  }
}

function toIncludeBoolean(
  property: string,
  str: string | string[],
  value: any
) {
  if (!(property in value && "spoken" in value)) {
    new Assertion(value).to.have.any.keys(property, "spoken");
  }

  if (property in value) {
    new Assertion(value[property]).to.be.true;
  } else if (Array.isArray(str)) {
    if (value.output?.phrases?.length) {
      new Assertion(value.output.phrases.join()).to.contain.oneOf(str);
    } else {
      new Assertion(value.spoken).to.contain.oneOf(str);
    }
  } else {
    new Assertion(value.spoken).to.contain(str);
  }
}

function toNotIncludeBoolean(
  property: string,
  str: string | string[],
  value: any
) {
  if (Array.isArray(str) && value.output?.phrases?.length) {
    new Assertion(value.output.phrases.join()).to.not.contain.oneOf(str);
  } else if (Array.isArray(str) && "spoken" in value) {
    new Assertion(value.spoken).to.not.contain.oneOf(str);
  } else if ("spoken" in value) {
    new Assertion(value.spoken).to.not.contain(str);
  } else if (property in value) {
    new Assertion(value[property]).to.be.false;
  } else {
    new Assertion(value).to.not.have.property(property);
  }
}

function toNotInclude(property: string, str: string | string[], value: any) {
  if (property in value && "spoken" in value) {
    new Assertion(value).to.have.any.keys(property, "spoken");
  }

  if (Array.isArray(str)) {
    if (property in value) {
      new Assertion(value.role).to.not.be.oneOf(str);
    } else if (value.output?.phrases?.length) {
      new Assertion(value.output.phrases.join()).to.not.contain.oneOf(str);
    } else {
      new Assertion(value.spoken).to.not.contain.oneOf(str);
    }
  } else if (property in value) {
    new Assertion(value.role).to.not.be.equal(str);
  } else if (value.output?.phrases?.length) {
    new Assertion(value.output.phrases.join()).to.not.contain(str);
  } else {
    new Assertion(value.spoken).to.not.contain(str);
  }
}

util.addChainableMethod(
  Assertion.prototype,
  "role",
  function (this: any, str: string | string[]) {
    const obj = util.flag(this, "object");
    if (util.flag(this, "negate")) {
      toNotInclude("role", str, obj);
    } else {
      toInclude("role", str, obj);
    }
  }
);

util.addChainableMethod(
  Assertion.prototype,
  "value",
  function (this: any, str: string | string[]) {
    const obj = util.flag(this, "object");
    if (util.flag(this, "negate")) {
      toNotInclude("value", str, obj);
    } else {
      toInclude("value", str, obj);
    }
  }
);

util.addChainableMethod(
  Assertion.prototype,
  "name",
  function (this: any, str: string) {
    const obj = util.flag(this, "object");
    if (util.flag(this, "negate")) {
      toNotInclude("name", str, obj);
    } else {
      toInclude("name", str, obj);
    }
  }
);

util.addChainableMethod(Assertion.prototype, "multiline", function (this: any) {
  const obj = util.flag(this, "object");

  if (obj && "multiline" in obj) {
    new Assertion(obj.multiline).to.be.true;
  } else if (obj && "spoken" in obj) {
    new Assertion(obj, "Multiline is optional in output").to.be.ok;
  } else {
    new Assertion(obj).to.have.any.keys("multiline", "spoken");
  }
});

util.addChainableMethod(Assertion.prototype, "expanded", function (this: any) {
  const obj = util.flag(this, "object");

  if (util.flag(this, "negate")) {
    toNotIncludeBoolean("expanded", "expanded", obj);
  } else {
    toIncludeBoolean("expanded", "expanded", obj);
  }
});

util.addChainableMethod(Assertion.prototype, "collapsed", function (this: any) {
  const obj = util.flag(this, "object");

  if (obj && "expanded" in obj) {
    new Assertion(obj.expanded).to.be.false;
  } else if (obj && "spoken" in obj) {
    new Assertion(obj.spoken).to.contain("collapsed");
  } else {
    new Assertion(obj).to.have.any.keys("expanded", "spoken");
  }
});

util.addChainableMethod(
  Assertion.prototype,
  "level",
  function (this: any, level: number) {
    const obj = util.flag(this, "object");

    if (obj && "level" in obj) {
      new Assertion(obj.level).to.equal(level);
    } else if (obj && "spoken" in obj) {
      const text = obj?.output?.phrases?.join?.() || obj.spoken;
      new Assertion(text).to.contain("level " + level);
    } else {
      new Assertion(obj).to.have.any.keys("level", "spoken");
    }
  }
);

util.addChainableMethod(Assertion.prototype, "invalid", function (this: any) {
  const obj = util.flag(this, "object");

  if (util.flag(this, "negate")) {
    toNotIncludeBoolean("invalid", "invalid data", obj);
  } else {
    toIncludeBoolean("invalid", "invalid data", obj);
  }
});

util.addProperty(Assertion.prototype, "selected", function (this: any) {
  const obj = util.flag(this, "object");

  if (util.flag(this, "negate")) {
    toNotIncludeBoolean("selected", "✓", obj);
  } else {
    toIncludeBoolean("selected", "✓", obj);
  }
});

util.addProperty(Assertion.prototype, "disabled", function (this: any) {
  const obj = util.flag(this, "object");

  if (util.flag(this, "negate")) {
    toNotIncludeBoolean("disabled", ["dimmed", "Disabled"], obj);
  } else {
    toIncludeBoolean("disabled", ["dimmed", "Disabled"], obj);
  }
});

export { expect };
