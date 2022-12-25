import { Form, useLoaderData } from "@remix-run/react";
import createServerSupabase from "utils/supabase.server";

import { ActionArgs, json, LoaderArgs } from "@remix-run/node";
import Login from "components/login";
import { createServerClient } from "@supabase/auth-helpers-remix";
import RealtimeMessages from "components/realtime-message";

export const action =async ({ request }: ActionArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response });

  const { message } = Object.fromEntries(await request.formData());
  const { error } = await supabase
    .from("messages")
    .insert({ content: String(message) })

  if (error) {
    console.log(error)
  }

  return json(null, { headers: response.headers })

  }


export const loader = async ({request}: LoaderArgs) => {
  const response = new Response();
  const supabase = createServerSupabase({ request, response })
  const { data } = await supabase.from('messages').select()
  return json({ message: data ?? [] }, { headers: response.headers });
}

export default function Index() {
  const {message} = useLoaderData<typeof loader>()
  return (<>
    <Login />
    <RealtimeMessages serverMessages={message} />
    <Form method="post">
      <input type="text" name="message" />
      <button type="submit">Send</button>
    </Form>
  </>
  )
}