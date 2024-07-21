import { redirect } from "next/navigation";
import { signIn, providerMap } from "@/auth";
import { AuthError } from "next-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: { error: string };
}) {
  return (
    <div className="flex min-h-screen justify-center items-center">
      <div className="flex flex-col gap-2 items-center border rounded p-5 max-w-xs">
        <div>Sign In</div>
        {Object.values(providerMap)
          .filter((provider) => provider.id !== "credentials")
          .map((provider) => (
            <form
              key={provider.id}
              className="flex flex-col gap-2 items-center w-full"
              action={async () => {
                "use server";
                try {
                  await signIn(provider.id, {
                    redirectTo: "/dashboard",
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`/signin/?error=${error.type}`);
                  }
                  throw error;
                }
              }}
            >
              <Button className="w-full" type="submit">
                <span>Sign in with {provider.name}</span>
              </Button>
            </form>
          ))}
        <div className="h-1 w-full border-b border-gray-200"></div>
        {Object.values(providerMap)
          .filter((provider) => provider.id === "credentials")
          .map((provider) => (
            <form
              key={provider.id}
              className="flex flex-col gap-2 items-center w-full"
              action={async (formData: FormData) => {
                "use server";
                try {
                  await signIn(provider.id, {
                    redirectTo: "/dashboard",
                    email: formData.get("email"),
                    password: formData.get("password"),
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`/signin/?error=${error.type}`);
                  }
                  throw error;
                }
              }}
            >
              <div className="w-full">
                <Label>Email</Label>
                <Input
                  type="text"
                  name="email"
                  placeholder="shadriz@example.com"
                />
              </div>
              <div className="w-full">
                <Label>Password</Label>
                <Input type="password" name="password" placeholder="password" />
              </div>
              <Button className="w-full" type="submit">
                <span>Sign in with {provider.name}</span>
              </Button>
            </form>
          ))}
        {searchParams.error === "CallbackRouteError" && (
          <div className="text-red-500">Sign in failed</div>
        )}
      </div>
    </div>
  );
}
