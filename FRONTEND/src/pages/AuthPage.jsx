import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();

    const handleLoginSuccess = () => {
        setTimeout(() => {
            navigate({ to: '/dashboard' });
        }, 1000);
    };

    return (
        <main className="min-h-screen w-full bg-nyc-dark text-white flex flex-col justify-between p-6 sm:px-10 sm:py-6">
            <header className="flex items-center justify-between border-b border-white/10 pb-4">
                <a className="text-2xl font-bold tracking-[-0.06em] select-none cursor-pointer outline-none" href="/" aria-label="RYL URL shortener home">
                    RYL<span className="text-nyc-yellow">.</span>
                </a>

                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsLogin(true)}
                        className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition cursor-pointer ${
                            isLogin
                                ? "bg-nyc-yellow text-nyc-ink"
                                : "border border-white/20 text-white/70 hover:text-white"
                        }`}
                    >
                        Sign In
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsLogin(false)}
                        className={`rounded-full px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition cursor-pointer ${
                            !isLogin
                                ? "bg-nyc-yellow text-nyc-ink"
                                : "border border-white/20 text-white/70 hover:text-white"
                        }`}
                    >
                        Register
                    </button>
                </div>
            </header>

            <div className="flex flex-1 items-center justify-center py-6 sm:py-8">
                <div className="w-full max-w-md">
                    {isLogin ? (
                        <LoginForm
                            onSuccess={handleLoginSuccess}
                            onSwitchToRegister={() => setIsLogin(false)}
                        />
                    ) : (
                        <RegisterForm
                            onSwitchToLogin={() => setIsLogin(true)}
                            onSuccess={() => {
                                setTimeout(() => {
                                    navigate({ to: '/dashboard' });
                                }, 1000);
                            }}
                        />
                    )}
                </div>
            </div>

            <footer className="flex flex-col gap-2 border-t border-white/10 pt-4 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
                <span>Short links for the next thing you share.</span>
                <span>Copyright {new Date().getFullYear()} RYL</span>
            </footer>
        </main>
    );
};

export default AuthPage;

