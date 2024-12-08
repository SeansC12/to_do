import type {
  MetaFunction,
  LoaderFunctionArgs,
  ActionFunctionArgs,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Link,
  Outlet,
  useFetcher,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { useState, useEffect } from "react";
import { DatePicker } from "~/components/DatePicker";
import { extractNameFromEmail } from "~/utils";
import { useUser } from "~/utils";

import { getTodoPageListItems, deleteTodoPage } from "~/models/todo.server";
import { requireUserId } from "~/session.server";

import TodoPageTabItem from "~/components/TodoPageTabItem";

import { Separator } from "~/components/ui/separator";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export const loader = async ({ params, request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const date = params.date ? new Date(params.date) : new Date();

  const todoPageListItems = await getTodoPageListItems({ userId, date: date });

  console.log(todoPageListItems);

  if (todoPageListItems) {
    return json({ todoPageListItems: todoPageListItems, dateInUrl: date });
  }
  return redirect(`/todos/${params.date}`);
};

export const action = async ({ params, request }: ActionFunctionArgs) => {
  const userId = await requireUserId(request);
  const formData = await request.formData();
  const todoPageId = formData.get("id");

  await deleteTodoPage({ id: todoPageId as string, userId });

  return redirect(`/todos/${params.date}`);
};

export default function Index() {
  const user = useUser();
  const navigate = useNavigate();
  const { todoPageListItems, dateInUrl } = useLoaderData<typeof loader>();
  const [date, setDate] = useState<Date>(new Date(dateInUrl));

  console.log(dateInUrl);

  return (
    <div className="flex w-full max-w-[1000px] flex-col items-center">
      <div className="flex flex-col gap-5">
        {user && <h1>{extractNameFromEmail(user.email)}'s To-Dos</h1>}
        <DatePicker date={date} setDate={setDate} navigate={navigate} />
      </div>
      <Separator />
      <div className="grid h-full w-full grid-cols-[25%_75%]">
        <div className="h-full border-r-[1px] border-neutral-800 p-2">
          {todoPageListItems.length === 0 ? (
            <p>No to-dos yet</p>
          ) : (
            <div className="flex flex-col">
              {todoPageListItems.map((todoPage) => (
                <TodoPageTabItem
                  date={dateInUrl.split("T")[0]}
                  title={todoPage.title}
                  id={todoPage.id}
                />
              ))}
            </div>
          )}
        </div>
        <div className="h-full w-full p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

// import { Link } from "@remix-run/react";

// export default function NoteIndexPage() {
//   return (
//     <p>
//       No note selected. Select a note on the left, or{" "}
//       <Link to="new" className="text-blue-500 underline">
//         create a new note.
//       </Link>
//     </p>
//   );
// }
