import type { MetaFunction } from "@remix-run/node";
import { Link, useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import { DatePicker } from "~/components/DatePicker";

import { extractNameFromEmail } from "~/utils";
import { useUser } from "~/utils";

import type { TodoPage } from "@prisma/client";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useUser();
  const todoPageItemsFetcher = useFetcher();
  const [date, setDate] = useState<Date>(new Date());
  const [todoPageListItems, setTodoPageListItems] = useState<
    Pick<TodoPage, "id" | "title">[]
  >([]);

  useEffect(() => {
    const fetchTodoPageItems = async () => {
      const data = await fetch(
        `/get-todo-page-items?date=${date.toDateString()}`,
      );
      const json = await data.json();
      setTodoPageListItems(json.todoPageListItems);
    };
    fetchTodoPageItems();
  }, [date]);

  return (
    <div className="flex w-full max-w-[1000px] flex-col items-center">
      <div className="flex flex-col gap-5">
        {user && <h1>{extractNameFromEmail(user.email)}'s To-Dos</h1>}
        <DatePicker
          date={date}
          setDate={setDate}
          todoPageItemsFetcher={todoPageItemsFetcher}
        />
      </div>
      <div>
        {todoPageListItems.length === 0 ? (
          <p>No to-dos yet</p>
        ) : (
          <ul>
            {todoPageListItems.map((todoPage) => (
              <li key={todoPage.id}>
                <Link to={`/${todoPage.id}`}>{todoPage.title}</Link>
              </li>
            ))}
          </ul>
        )}
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
