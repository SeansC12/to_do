import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useEffect, useRef } from "react";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

import { createTodoPage } from "~/models/todo.server";
import { requireUserId } from "~/session.server";

import { validateTodoPageName } from "~/utils";

import InputErrorText from "~/components/InputErrorText";

export const action = async ({ request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const todayDate = new Date().toISOString().split("T")[0];

  const formData = await request.formData();
  const title = formData.get("title") as string;

  const { valid, message } = validateTodoPageName(title);
  if (!valid) {
    return json({ todoPageNameError: message }, { status: 400 });
  }

  if (typeof title !== "string" || title.length === 0) {
    return json(
      { errors: { body: null, title: "Title is required" } },
      { status: 400 },
    );
  }

  const todoPage = await createTodoPage({ title, userId });

  return redirect(`/${todayDate}/${todoPage.id}`);
};

export default function NewNotePage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (actionData && "todoPageNameError" in actionData) {
      titleRef.current?.focus();
    }
  }, [actionData]);

  return (
    <Form
      method="post"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 8,
        width: "100%",
      }}
    >
      <div>
        <div className="flex w-full flex-col gap-1">
          <span className="mb-5 text-3xl font-bold">
            Create a new todo page
          </span>
          <div className="flex gap-3">
            <Input
              ref={titleRef}
              name="title"
              placeholder="The title of your todo page."
              className="flex-1 rounded-md border-2 border-blue-500 px-3 text-lg leading-loose"
              aria-invalid={
                actionData && "todoPageNameError" in actionData
                  ? true
                  : undefined
              }
              aria-errormessage={
                actionData && "todoPageNameError" in actionData
                  ? "title-error"
                  : undefined
              }
            />
            <Button
              type="submit"
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
            >
              Add page
            </Button>
          </div>
          {actionData && "todoPageNameError" in actionData ? (
            <InputErrorText error={actionData.todoPageNameError} />
          ) : null}
        </div>
      </div>
    </Form>
  );
}
