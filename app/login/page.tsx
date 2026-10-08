import { login } from "@/app/actions";

export const metadata = { title: "Login · India Innovation Portal" };

const ROLES = [
  {
    value: "citizen",
    title: "Citizen",
    desc: "Report community problems in your area.",
    icon: "🧑‍🌾",
  },
  {
    value: "university",
    title: "Institution",
    desc: "Review challenges, create projects and build solutions.",
    icon: "🎓",
  },
  {
    value: "industry",
    title: "Industry",
    desc: "Browse projects, provide mentorship, funding or technology.",
    icon: "🏭",
  },
  {
    value: "government",
    title: "Government",
    desc: "Monitor challenges, assignments and district analytics.",
    icon: "🏛️",
  },
  {
    value: "admin",
    title: "Platform Admin",
    desc: "Manage all platform records and moderate challenges.",
    icon: "⚙️",
  },
];

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const params = await searchParams;
  const error = params?.error === "1";

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Sign in</h1>
      <p className="mt-2 text-black/60">
        Choose your role to continue. This is a demo login — no account needed.
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
          Incorrect staff password. Use <code className="font-mono">demo123</code>.
        </div>
      )}

      <form
        action={login}
        className="mt-6 space-y-5 rounded-xl bg-white p-6 shadow-sm border border-black/5"
      >
        <fieldset>
          <legend className="text-sm font-medium mb-2">I am a…</legend>
          <div className="grid sm:grid-cols-3 gap-3">
            {ROLES.map((r, i) => (
              <label
                key={r.value}
                className="cursor-pointer rounded-lg border border-black/10 p-3 has-[:checked]:border-brand has-[:checked]:bg-brand/5 transition"
              >
                <input
                  type="radio"
                  name="role"
                  value={r.value}
                  defaultChecked={i === 0}
                  className="sr-only"
                />
                <div className="text-2xl">{r.icon}</div>
                <div className="mt-1 font-semibold text-sm">{r.title}</div>
                <div className="text-xs text-black/55 mt-0.5">{r.desc}</div>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="block">
          <span className="text-sm font-medium">Your name / organisation</span>
          <input
            name="name"
            placeholder="e.g. Sunita Devi / BIT Mesra"
            className="input mt-1.5"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium">Staff password</span>
          <span className="text-xs text-black/40 ml-2">
            Only for University / Admin · demo: demo123
          </span>
          <input
            name="password"
            type="password"
            placeholder="demo123"
            className="input mt-1.5"
          />
        </label>

        <button
          type="submit"
          className="w-full rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand-dark"
        >
          Continue
        </button>
      </form>
    </div>
  );
}
