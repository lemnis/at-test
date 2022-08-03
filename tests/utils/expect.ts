import { expect, util, Assertion } from "chai";
import { AccessibilityNode, Output } from "../../codeceptjs/helpers/base";

declare global {
  export namespace Chai {
    interface Assertion {
      role(str: string | string[]): Assertion;
      exactName(str: string | string[]): Assertion;
      name(str: string | string[]): Assertion;
      value(str: string | string[]): Assertion;
      multiline(): Assertion;
      expanded: Assertion;
      collapsed: Assertion;
      invalid(): Assertion;
      level(level: number): Assertion;
      size(size: number): Assertion;
      position(size: number): Assertion;
      selected: Assertion;
      disabled: Assertion;
    }
  }
}

const getChildName = (child: AccessibilityNode): string | undefined => {
  if (child?.name === "") {
    return (child.children || [])
      .map((c) => getChildName(c))
      .filter(Boolean)
      .join(",");
  }
  return child?.name;
};

function toInclude(
  property: keyof Output,
  str: string | string[],
  value: Output
) {
  if(!value) new Assertion(value).to.exist;
  if (!(property in value && "spoken" in value)) {
    new Assertion(value).to.have.any.keys(property, "spoken");
  }

  let full = value[property];
  if (property === "name" && full === "" && value.children?.length)
    full = getChildName(value as any);

  if (Array.isArray(str)) {
    if (property in value) {
      new Assertion(full).to.be.oneOf(str);
    } else if (value.output?.phrases?.length) {
      new Assertion(value.output.phrases.join()).to.contain.oneOf(str);
    } else {
      new Assertion(value.spoken).to.contain.oneOf(str);
    }
  } else if (property in value) {
    new Assertion(full).to.be.equal(str);
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

util.addChainableMethod(
  Assertion.prototype,
  "exactName",
  function (this: any, str: string) {
    const obj = util.flag(this, "object");
    if (!("name" in obj && "spoken" in obj)) {
      new Assertion(obj).to.have.any.keys("name", "spoken");
    }
  
    let full = obj["name"];
    if ("name" === "name" && full === "" && obj.children?.length)
      full = getChildName(obj as any);
  
    if (Array.isArray(str)) {
      if ("name" in obj) {
        new Assertion(full).to.be.oneOf(str);
      } else if (obj.output?.phrases?.length) {
        new Assertion(obj.output.phrases).to.contain.oneOf(str);
      } else {
        new Assertion(obj.spoken).to.contain.oneOf(str);
      }
    } else if ("name" in obj) {
      new Assertion(full).to.be.equal(str);
    } else if (obj.output?.phrases?.length) {
      new Assertion(obj.output.phrases).to.contain(str);
    } else {
      new Assertion(obj.spoken).to.contain(str);
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

util.addProperty(Assertion.prototype, "expanded", function (this: any) {
  const obj = util.flag(this, "object");

  if (util.flag(this, "negate")) {
    toNotIncludeBoolean("expanded", "expanded", obj);
  } else {
    toIncludeBoolean("expanded", "expanded", obj);
  }
});

util.addProperty(Assertion.prototype, "collapsed", function (this: any) {
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

util.addChainableMethod(
  Assertion.prototype,
  "size",
  function (this: any, size: number) {
    const obj = util.flag(this, "object");

    if (util.flag(this, "negate")) {
      if (obj && "size" in obj) {
        new Assertion(obj.size).to.not.equal(size);
      } else if (obj && "spoken" in obj) {
        const text = obj?.output?.phrases?.join?.() || obj.spoken;
        new Assertion(text).to.not.contain(`${size} of`);
      } else {
        new Assertion(obj).to.not.have.any.keys("size", "spoken");
      }
    } else if (obj && "size" in obj) {
      new Assertion(obj.size).to.equal(size);
    } else if (obj && "spoken" in obj) {
      const text = obj?.output?.phrases?.join?.() || obj.spoken;
      new Assertion(text).to.contain(`${size} of`);
    } else {
      new Assertion(obj).to.have.any.keys("size", "spoken");
    }
  }
);

util.addChainableMethod(
  Assertion.prototype,
  "position",
  function (this: any, position: number) {
    const obj = util.flag(this, "object");

    if(!("spoken" in obj) && !("posinset" in obj)) {
      new Assertion(obj).to.have.any.keys("posinset", "spoken");
    } else if (util.flag(this, "negate")) {
      if (obj && "posinset" in obj) {
        new Assertion(obj.position).to.not.equal(position);
      } else if (obj && "spoken" in obj) {
        const text = obj?.output?.phrases?.join?.() || obj.spoken;
        new Assertion(text).to.not.contain(position)
      }
    } else if (obj && "posinset" in obj) {
      new Assertion(obj.position).to.equal(position);
    } else if (obj && "spoken" in obj) {
      const text = obj?.output?.phrases?.join?.() || obj.spoken;
      new Assertion(text).to.contain(position)
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
