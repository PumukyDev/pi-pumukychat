import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import ThemeToggle from '@/Components/App/ThemeToggle'; // ← importamos el switch

// Guest layout used for unauthenticated pages like login, register, and password reset
export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-base-100 text-base-content relative">
            {/* Toggle in top-right corner */}
            <div className="absolute top-4 right-4">
                <ThemeToggle />
            </div>

            {/* Logo */}
            <div>
                <Link href="/">
                    <ApplicationLogo className="w-40 h-40 fill-current text-base-content/70" />
                </Link>
            </div>

            {/* Form container */}
            <div className="w-full sm:max-w-md mt-6 px-6 py-6 bg-base-200 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
