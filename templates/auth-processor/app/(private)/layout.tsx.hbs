import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { PrivateSidebar } from "@/components/private/private-sidebar";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";
import { users } from "@/schema/users";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
  });

  if (!user) {
    redirect("/signin");
  }

  return (
    <div>
      <SidebarProvider>
        <PrivateSidebar user={user} />
        <main className="p-5 w-full">
          <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}
