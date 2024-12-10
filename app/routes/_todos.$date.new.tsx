import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { useEffect, useRef } from "react";

import InputErrorText from "~/components/InputErrorText";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { createTodoPage } from "~/models/todo.server";
import { requireUserId } from "~/session.server";
import { validateTodoPageName } from "~/utils";

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const todayDate = new Date().toISOString().split("T")[0];
  const createdAt = params.date ? new Date(params.date) : new Date();

  const formData = await request.formData();
  const title = formData.get("title") as string;

  const { valid, message } = validateTodoPageName(title);
  if (!valid) {
    return json({ todoPageNameError: message }, { status: 400 });
  }

  console.log("new action", createdAt.toISOString());

  const todoPage = await createTodoPage({ title, userId, createdAt });
  console.log("date", todayDate);

  return redirect(`/${createdAt.toISOString().split("T")[0]}/${todoPage.id}`);
};

export default function NewTodoPage() {
  const actionData = useActionData<typeof action>();
  const titleRef = useRef<HTMLInputElement>(null);

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

export function ErrorBoundary() {
  const error = useRouteError();

  if (error instanceof Error) {
    return <div>An unexpected error occurred: {error.message}</div>;
  }

  if (!isRouteErrorResponse(error)) {
    return <h1>Unknown Error</h1>;
  }

  return <div>An unexpected error occurred: {error.data}</div>;
}
