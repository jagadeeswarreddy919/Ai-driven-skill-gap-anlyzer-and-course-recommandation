import { redirect } from "next/navigation";
import { getSessionUser } from "@/lib/auth";
import { ensureSubscription, getUserSubscription } from "@/lib/subscription/access";
import AppSidebar from "@/components/app/AppSidebar";
import AppHeader from "@/components/app/AppHeader";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  
  await ensureSubscription(user.id);
  const sub = await getUserSubscription(user.id);
  const plan = (sub.status === "ACTIVE" || sub.status === "TRIALING") ? sub.plan : "FREE";

  return (
    <div className="min-h-screen bg-[#FAF9FF] flex font-sans">
      <AppSidebar user={{ name: user.name ?? "User", email: user.email, isAdmin: user.isAdmin ?? false }} plan={plan as string} />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader user={{ name: user.name ?? "User" }} plan={plan as string} />
        <main className="flex-1 p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
