import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
  useFetcher,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import {
  getTodoPage,
  deleteTodoPage,
  getAllTodos,
  modifyTodoStatus,
} from "~/models/todo.server";
import { requireUserId } from "~/session.server";

import { TodoCheckbox } from "~/components/Checkbox";

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

export const action = async ({ request }: ActionFunctionArgs) => {
  const formData = await request.formData();

  const todoId = formData.getAll("id")[0] as string;
  const checkedStatus = formData.getAll("checked")[0] === "true" ? true : false;

  await modifyTodoStatus({ id: todoId, checkedStatus: checkedStatus });
  return json({ message: "success" });
};

export default function TodoPageDetails() {
  const data = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  console.log(data.todos);

  return (
    <div>
      <h1 className="text-3xl font-bold">{data.todoPageName}</h1>

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
      {/* <Form method="post">
        <button
          type="submit"
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 focus:bg-blue-400"
        >
          Delete
        </button>
      </Form> */}
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
