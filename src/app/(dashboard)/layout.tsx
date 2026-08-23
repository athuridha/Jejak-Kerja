import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/session";
import { auth } from "../../../auth";
import { doSignOut } from "@/lib/actions/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/applications", label: "Lamaran Saya" },
  { href: "/statuses", label: "Status" },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-slate-200 bg-white md:w-60 md:border-b-0 md:border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold">Job Tracker</h2>
          <p className="truncate text-xs text-slate-500">
            {session?.user?.email}
          </p>
        </div>
        <nav className="flex gap-1 overflow-x-auto p-2 md:flex-col">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap rounded-md px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <form action={doSignOut} className="p-2">
          <button
            type="submit"
            className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
          >
            Sign out
          </button>
        </form>
      </aside>
      <main className="flex-1 p-4 md:p-8">{children}</main>
    </div>
  );
}
