import type { MetaFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, redirect } from "@remix-run/react";

import { requireUserId } from "~/session.server";
import { useOptionalUser } from "~/utils";

export const meta: MetaFunction = () => [{ title: "Todo app" }];

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const userId = await requireUserId(request);
  const todayDate = new Date();
  const date = todayDate.toISOString().split("T")[0]; // in the correct yyyy-mm-dd format

  if (userId) {
    return redirect(`/${date}`);
  }
  return redirect("/login");
};

export default function Index() {
  const user = useOptionalUser();
  return (
    <div>
      <h1>Remix Todos</h1>
      {user ? <Link to="/">Go to todos</Link> : <Link to="/login">Login</Link>}
    </div>
  );
}
