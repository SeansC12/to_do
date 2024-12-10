import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import { DatePicker } from "~/components/DatePicker";
import { extractNameFromEmail } from "~/utils";
import { useUser } from "~/utils";

import { getTodoPageListItems, deleteTodoPage } from "~/models/todo.server";
import { requireUserId } from "~/session.server";

import TodoPageTabItem from "~/components/TodoPageTabItem";
import CreateTodoPageTabItem from "~/components/CreateTodoPageTabItem";

import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const date = params.date ? new Date(params.date) : new Date();

  const todoPageListItems = await getTodoPageListItems({ userId, date: date });

  if (todoPageListItems) {
  }
  return json({ todoPageListItems: todoPageListItems, dateInUrl: date });
  // return redirect(`/${params.date}`);
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const todoPageId = formData.get("id");

  await deleteTodoPage({ id: todoPageId as string, userId });

  return redirect(`/${params.date}`);
};

export default function Index() {
  const user = useUser();
  const navigate = useNavigate();
  const { todoPageListItems, dateInUrl } = useLoaderData<typeof loader>();
  const [date, setDate] = useState<Date>(new Date(dateInUrl));

  console.log(dateInUrl);

  return (
    <div className="flex w-full max-w-[1000px] flex-col items-center">
      <div className="mb-5 flex w-full flex-row items-start justify-between gap-5">
        {user.email && <h1>{extractNameFromEmail(user.email)}'s To-Dos</h1>}
        <DatePicker date={date} setDate={setDate} navigate={navigate} />
        <Form action="/logout" method="post">
          <Button
            type="submit"
            className="rounded bg-slate-600 px-4 py-2 text-blue-100 hover:bg-blue-500 active:bg-blue-600"
          >
            Logout
          </Button>
        </Form>
      </div>
      <Separator />
      <div className="grid h-full w-full grid-cols-[30%_70%]">
        <div className="h-full border-r-[1px] border-neutral-800 p-2">
          {todoPageListItems.length === 0 ? (
            <p>No to-dos yet</p>
          ) : (
            <div className="flex flex-col">
              {todoPageListItems.map((todoPage) => (
                <div key={todoPage.id}>
                  <TodoPageTabItem
                    date={dateInUrl.split("T")[0]}
                    title={todoPage.title}
                    id={todoPage.id}
                  />
                </div>
              ))}
            </div>
          )}
          <CreateTodoPageTabItem date={dateInUrl.split("T")[0]} />
        </div>
        <div className="h-full w-full p-6">
          <Outlet />
        </div>
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
    return <div>Unknown Error</div>;
  }

  return <div>An unexpected error occurred</div>;
}
