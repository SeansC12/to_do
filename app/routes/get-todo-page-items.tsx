import type { LoaderFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";

import { getTodoPageListItems } from "~/models/todo.server";
import { requireUserId } from "~/session.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const url = new URL(request.url);
  const dateString = url.searchParams.get("date");
  const date = dateString ? new Date(dateString) : new Date();

  const todoPageListItems = await getTodoPageListItems({ userId, date: date });

  console.log(todoPageListItems);

  if (todoPageListItems) {
    return json({ todoPageListItems });
  }
  return redirect("/todos");
};
