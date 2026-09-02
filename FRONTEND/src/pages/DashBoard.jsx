import { useSelector } from "react-redux";
import NavBar from "../components/NavBar";
import UserUrl from "../components/UserUrl";

export default function DashboardPage() {
  const { user } = useSelector((state) => state.auth);

  return (
    <main className="min-h-screen bg-nyc-black px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col rounded-[2rem] border border-white/15 bg-nyc-dark p-6 shadow-nyc sm:p-10">
        <NavBar />
        <div className="mb-8 mt-10">
          <p className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-nyc-yellow">Welcome back</p>
          <h1 className="text-3xl font-bold sm:text-4xl">{user?.name ?? "Dashboard"}<span className="text-nyc-yellow">.</span></h1>
          <p className="mt-1 text-sm text-white/50">Track and manage all your shortened links from one place.</p>
        </div>
        <UserUrl />
      </section>
    </main>
  );
}
