import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import { useState, useEffect } from "react";
import { DatePicker } from "~/components/DatePicker";

import { useOptionalUser, extractNameFromEmail } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Remix Notes" }];

export default function Index() {
  const user = useOptionalUser();
  const [date, setDate] = useState<Date>(new Date());

  useEffect(() => {
    console.log(date);
  }, [date]);

  return (
    <div className="flex w-full max-w-[1000px] flex-col items-center">
      <div className="flex flex-col gap-5">
        {user && <h1>{extractNameFromEmail(user.email)}'s To-Dos</h1>}
        <DatePicker date={date} setDate={setDate} />
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
