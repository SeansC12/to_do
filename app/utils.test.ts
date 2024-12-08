import {
  validateEmail,
  extractNameFromEmail,
  validateTodoPageName,
  validateTodoContent,
} from "./utils";
import { faker } from "@faker-js/faker";

describe("validateEmail function", () => {
  test("validateEmail returns false for non-emails", () => {
    expect(validateEmail(undefined)).toBe(false);
    expect(validateEmail(null)).toBe(false);
    expect(validateEmail("")).toBe(false);
    expect(validateEmail("not-an-email")).toBe(false);
    expect(validateEmail("n@")).toBe(false);
    expect(validateEmail("n@n@")).toBe(false);
  });

  test("validateEmail returns true for emails", () => {
    for (let i = 0; i < 35; i++) {
      const email = faker.internet.email();
      expect(validateEmail(email)).toBe(true);
    }
  });
});

describe("extractNameFromEmail function", () => {
  test("extractNameFromEmail returns the name from an email", () => {
    expect(extractNameFromEmail("sean@test.com")).toEqual("sean");
    expect(extractNameFromEmail("sean@")).toEqual("sean");
    expect(extractNameFromEmail("sean")).toEqual("sean");
    expect(extractNameFromEmail("sean@not-an-email")).toEqual("sean");
    expect(extractNameFromEmail("test@sean@not-an-email")).toEqual("test");
  });
});

describe("validateTodoPageName function", () => {
  test("validateTodoPageName returns false for invalid page names", () => {
    expect(validateTodoPageName(undefined)).toEqual({
      valid: false,
      message: "Page name must be a string",
    });
    expect(validateTodoPageName("")).toEqual({
      valid: false,
      message: "Page name must be between 1 and 30 characters",
    });
    expect(validateTodoPageName("a".repeat(31))).toEqual({
      valid: false,
      message: "Page name must be between 1 and 30 characters",
    });
    expect(validateTodoContent("not valid test 😃")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("☃☃")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("éö")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("متنی漢")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
  });

  test("validateTodoPageName returns true for valid page names", () => {
    expect(validateTodoPageName("valid name")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoPageName("a".repeat(30))).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoPageName("a")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoPageName("Lorem ipsum dolor sit amet")).toEqual({
      valid: true,
      message: "",
    });
  });
});

describe("validateTodoContent function", () => {
  test("validateTodoContent returns false for invalid todo content", () => {
    expect(validateTodoContent(undefined)).toEqual({
      valid: false,
      message: "Todo content must be a string",
    });
    expect(validateTodoContent("")).toEqual({
      valid: false,
      message: "Todo content must be between 1 and 150 characters",
    });
    expect(validateTodoContent("a".repeat(151))).toEqual({
      valid: false,
      message: "Todo content must be between 1 and 150 characters",
    });
    expect(validateTodoContent("not valid test 😃")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("☃☃")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("éö")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
    expect(validateTodoContent("متنی漢")).toEqual({
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    });
  });

  test("validateTodoContent returns true for valid todo content", () => {
    expect(validateTodoContent("valid content")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoContent("a".repeat(150))).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoContent("a")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoContent("Lorem ipsum dolor sit amet")).toEqual({
      valid: true,
      message: "",
    });
    expect(validateTodoContent("Lorem ipsum $ #*(@(*)).")).toEqual({
      valid: true,
      message: "",
    });
  });
});
