import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useFetcher,
  useNavigation,
  useActionData,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  getTodoPage,
  deleteTodoPage,
  getAllTodos,
  createTodo,
  modifyTodoStatus,
  deleteTodo,
} from "~/models/todo.server";
import { requireUserId } from "~/session.server";

import { validateTodoContent } from "~/utils";

import InputErrorText from "~/components/InputErrorText";

import { TodoCheckbox } from "~/components/TodoCheckbox";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useEffect, useRef } from "react";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.todoPageId, "todoPageId not found");

  const todos = await getAllTodos({ todoPageId: params.todoPageId });
  console.log(todos);
  if (!todos) {
    // throw new Response("Not Found", { status: 404 });
    throw new Error("Todo page not found.");
  }

  const userId = await requireUserId(request);
  const todoPageName = await getTodoPage({
    id: params.todoPageId,
    userId: userId,
  });

  return json({
    todos,
    todoPageName: todoPageName ? todoPageName.title : "Untitled",
  });
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const formData = await request.formData();
  const todoId = formData.getAll("id")[0] as string;

  const isCreatingTodo = formData.get("intent") === "createTodo";
  const isModifyingTodoStatus = formData.get("intent") === "modifyTodoStatus";

  if (isModifyingTodoStatus) {
    const checkedStatus = formData.get("checked") === "true" ? true : false;

    await modifyTodoStatus({ id: todoId, checkedStatus: checkedStatus });

    return json({ message: "success" });
  } else if (isCreatingTodo) {
    // Data validation (only exists for creating Todo)
    const content = formData.getAll("todoName")[0] as string;
    const { valid, message } = validateTodoContent(content);

    if (!valid) {
      return json({ todoContentError: message }, { status: 400 });
    }

    // Creating todo

    await createTodo({
      content,
      todoPageId: params.todoPageId as string,
    });

    return redirect(`/${params.date}/${params.todoPageId}`);
  } else {
    // Delete todo
    await deleteTodo({ id: todoId });

    return redirect(`/${params.date}/${params.todoPageId}`);
  }
};

export default function TodoPageDetails() {
  const data = useLoaderData<typeof loader>();
  let navigation = useNavigation();
  const fetcher = useFetcher();
  let formRef = useRef<HTMLFormElement>(null);
  let inputRef = useRef<HTMLInputElement>(null);
  let isAddingTodo = navigation.state === "submitting";

  const actionData = useActionData<typeof action>();

  useEffect(() => {
    if (isAddingTodo) {
      formRef.current?.reset();
    }
  }, [isAddingTodo]);

  useEffect(() => {
    if (actionData && "todoContentError" in actionData) {
      inputRef.current?.focus();
    }
  }, [actionData]);

  console.log(data.todos);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{data.todoPageName}</h1>

      <Form className="mb-8" ref={formRef} method="post">
        <div className="flex gap-3">
          <Input
            ref={inputRef}
            name="todoName"
            placeholder="Buy groceries"
            aria-invalid={
              actionData && "todoContentError" in actionData ? true : undefined
            }
            aria-errormessage={
              actionData && "todoContentError" in actionData
                ? "content-error"
                : undefined
            }
          />
          <Button type="submit" name="intent" value="createTodo">
            Add
          </Button>
        </div>
        {actionData && "todoContentError" in actionData ? (
          <InputErrorText error={actionData.todoContentError} />
        ) : null}
      </Form>

      <div className="flex flex-col gap-3">
        {data.todos.map((todo) => (
          <div key={todo.id}>
            <TodoCheckbox
              content={todo.content}
              todoId={todo.id}
              isChecked={todo.completed}
              fetcher={fetcher}
            />
          </div>
        ))}
      </div>
    </div>
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
