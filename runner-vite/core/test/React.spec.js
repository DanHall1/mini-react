import React from "../React.js";
import { it, expect, describe } from "vitest";

describe("happy-dom", () => {
  it("should render a div", () => {
    const APP = React.createElement("div", null, "Hello World");

    expect(APP).toMatchInlineSnapshot();
  });
});
