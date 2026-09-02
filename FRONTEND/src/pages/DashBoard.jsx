import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import UserUrl from "../components/UserUrl";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <main className="h-dvh overflow-hidden bg-nyc-black px-4 py-4 text-white sm:px-6 lg:px-8">
      <div className="mx-auto flex h-full w-full max-w-5xl flex-col">
        <section className="rounded-[2rem] border border-white/15 bg-nyc-dark px-6 py-6 shadow-nyc sm:px-10">
          <NavBar />
        </section>
        <section className="mt-4 flex min-h-0 flex-1 flex-col rounded-[2rem] border border-white/15 bg-nyc-dark p-6 shadow-nyc sm:p-10">
          <div className="mb-8">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-nyc-yellow">Welcome back</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{user?.name ?? "Dashboard"}<span className="text-nyc-yellow">.</span></h1>
          <p className="mt-1 text-sm text-white/50">Track and manage all your shortened links from one place.</p>
          </div>
          <div className="min-h-0 flex-1">
            <UserUrl />
          </div>
        </section>
      </div>
    </main>
  );
}
