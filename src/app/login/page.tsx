import { devSignIn } from "@/lib/actions/auth";

export default function LoginPage() {
  const hasGoogle = !!process.env.AUTH_GOOGLE_ID;

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 p-6">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Job Application Tracker</h1>
        <p className="mt-2 text-sm text-slate-500">
          Track your job applications in one structured dashboard.
        </p>
      </div>

      <form
        action={devSignIn}
        className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
      >
        <label className="text-sm font-medium">Email</label>
        <input
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <label className="text-sm font-medium">Name (optional)</label>
        <input
          name="name"
          type="text"
          placeholder="Your name"
          className="rounded-md border border-slate-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="mt-2 rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
        >
          Sign in (dev)
        </button>
      </form>

      {hasGoogle ? (
        <p className="text-center text-xs text-slate-400">
          Google OAuth is configured. Use{" "}
          <code className="font-mono">/api/auth/signin</code> for the Google flow.
        </p>
      ) : (
        <p className="text-center text-xs text-slate-400">
          Set AUTH_GOOGLE_ID / AUTH_GOOGLE_SECRET to enable Google sign-in.
        </p>
      )}
    </main>
  );
}
