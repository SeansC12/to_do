import { useMatches } from "@remix-run/react";
import { useMemo } from "react";

import type { User } from "~/models/user.server";

const DEFAULT_REDIRECT = "/";

/**
 * This should be used any time the redirect path is user-provided
 * (Like the query string on our login/signup pages). This avoids
 * open-redirect vulnerabilities.
 * @param {string} to The redirect destination
 * @param {string} defaultRedirect The redirect to use if the to is unsafe.
 */
export function safeRedirect(
  to: FormDataEntryValue | string | null | undefined | number,
  defaultRedirect: string = DEFAULT_REDIRECT,
) {
  if (!to || typeof to !== "string") {
    return defaultRedirect;
  }

  if (!to.startsWith("/") || to.startsWith("//")) {
    return defaultRedirect;
  }

  return to;
}

/**
 * This base hook is used in other hooks to quickly search for specific data
 * across all loader data using useMatches.
 * @param {string} id The route id
 * @returns {JSON|undefined} The router data or undefined if not found
 */
export function useMatchesData(
  id: string,
): Record<string, unknown> | undefined {
  const matchingRoutes = useMatches();
  const route = useMemo(
    () => matchingRoutes.find((route) => route.id === id),
    [matchingRoutes, id],
  );
  return route?.data as Record<string, unknown>;
}

export function isUser(user: unknown): user is User {
  return (
    user != null &&
    typeof user === "object" &&
    "email" in user &&
    typeof user.email === "string"
  );
}

export function useOptionalUser(): User | undefined {
  const data = useMatchesData("root");
  if (!data || !isUser(data.user)) {
    return undefined;
  }
  return data.user;
}

export function useUser(): User {
  const maybeUser = useOptionalUser();
  if (!maybeUser) {
    throw new Error(
      "No user found in root loader, but user is required by useUser. If user is optional, try useOptionalUser instead.",
    );
  }
  return maybeUser;
}

export function validateEmail(email: unknown): email is string {
  if (typeof email !== "string") {
    return false;
  }
  return !!email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
}

export function extractNameFromEmail(email: User["email"]) {
  const nameMatch = email.match(/^([^@]*)@/);
  const name = nameMatch ? nameMatch[1] : email;
  return name;
}

// Todo validation
export function validateTodoPageName(name: unknown): {
  valid: boolean;
  message: string;
} {
  const typeCheck = typeof name === "string";

  if (!typeCheck) {
    return { valid: false, message: "Page name must be a string" };
  }

  const lengthCheck = name.length > 0 && name.length <= 30;
  // eslint-disable-next-line no-control-regex
  const asciiCharacterCheck = /^[\x00-\x7F]*$/.test(name);

  if (!lengthCheck) {
    return {
      valid: false,
      message: "Page name must be between 1 and 30 characters",
    };
  }

  if (!asciiCharacterCheck) {
    return {
      valid: false,
      message: "Page name must only contain letters, numbers, and spaces",
    };
  }

  return { valid: true, message: "" };
}

export function validateTodoContent(content: unknown): {
  valid: boolean;
  message: string;
} {
  const typeCheck = typeof content === "string";

  if (!typeCheck) {
    return { valid: false, message: "Todo content must be a string" };
  }

  const lengthCheck = content.length > 0 && content.length <= 150;
  // Add character check to include all ascii characters
  // eslint-disable-next-line no-control-regex
  const asciiCharacterCheck = /^[\x00-\x7F]*$/.test(content);

  if (!lengthCheck) {
    return {
      valid: false,
      message: "Todo content must be between 1 and 150 characters",
    };
  }

  if (!asciiCharacterCheck) {
    return {
      valid: false,
      message:
        "Todo content must only contain alphanumeric characters and basic special characters",
    };
  }

  return { valid: true, message: "" };
}
