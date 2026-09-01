import NavBar from "../components/NavBar";

export default function DashboardPage() {
  return (
    <main className="min-h-screen bg-nyc-black px-4 py-6 text-white sm:px-6 lg:px-8">
      <section className="mx-auto flex min-h-[calc(100vh-3rem)] w-full max-w-5xl flex-col rounded-[2rem] border border-white/15 bg-nyc-dark p-6 shadow-nyc sm:p-10">
        <NavBar />
        
        <div className="flex flex-1 items-center justify-center py-12 sm:py-16">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
              Dashboard
            </h1>
            <p className="mt-4 text-base text-white/60">
              Manage your shortened links and analytics here.
            </p>
          </div>
        </div>

        <footer className="flex flex-col gap-2 border-t border-white/15 pt-5 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>Short links for the next thing you share.</span>
          <span>Copyright {new Date().getFullYear()} RYL</span>
        </footer>
      </section>
    </main>
  );
}