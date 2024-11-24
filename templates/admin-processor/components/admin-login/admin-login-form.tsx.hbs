"use client";

import { startTransition, useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AdminLoginState, adminLogin } from "@/actions/admin-login/admin-login";

export function AdminLoginForm() {
  const initialState: AdminLoginState = {};
  const [state, dispatch] = useActionState(adminLogin, initialState);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    startTransition(() => dispatch(formData));
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form
          key={"credentials"}
          className="flex flex-col gap-2 items-center w-full mb-5"
          action={dispatch}
          onSubmit={handleSubmit}
        >
          <div className="w-full">
            <Label>Email</Label>
            <Input type="text" name="email" placeholder="user@example.com" />
          </div>
          <div className="w-full">
            <Label>Password</Label>
            <Input type="password" name="password" placeholder="password" />
          </div>
          <Button className="w-full" type="submit">
            <span>Sign in</span>
          </Button>
        </form>
        {state.message && <p>{state.message}</p>}
      </CardContent>
    </Card>
  );
}
