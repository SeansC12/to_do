import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useFetcher,
  useNavigation,
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

import { TodoCheckbox } from "~/components/TodoCheckbox";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { useEffect, useRef } from "react";

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  invariant(params.todoPageId, "noteId not found");

  const todos = await getAllTodos({ todoPageId: params.todoPageId });
  if (!todos) {
    throw new Response("Not Found", { status: 404 });
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
    const checkedStatus =
      formData.getAll("checked")[0] === "true" ? true : false;

    await modifyTodoStatus({ id: todoId, checkedStatus: checkedStatus });

    return json({ message: "success" });
  } else if (isCreatingTodo) {
    // Creating todo
    const content = formData.getAll("todoName")[0] as string;

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
  let isAddingTodo = navigation.state === "submitting";

  useEffect(() => {
    if (isAddingTodo) {
      formRef.current?.reset();
    }
  }, [isAddingTodo]);

  console.log(data.todos);

  return (
    <div>
      <h1 className="mb-8 text-3xl font-bold">{data.todoPageName}</h1>

      <Form className="mb-8 flex gap-3" ref={formRef} method="post">
        <Input name="todoName" placeholder="Buy groceries" />
        <Button type="submit" name="intent" value="createTodo">
          Add
        </Button>
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

  if (error.status === 404) {
    return <div>Note not found</div>;
  }

  return <div>An unexpected error occurred: {error.statusText}</div>;
}
