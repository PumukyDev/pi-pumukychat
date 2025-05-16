import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

// Guest layout used for unauthenticated pages like login, register, and password reset
export default function Guest({ children }) {
    return (
        <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-base-100 text-base-content">
            <div>
                <Link href="/">
                    <ApplicationLogo className="w-20 h-20 fill-current text-base-content/70" />
                </Link>
            </div>

            <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-base-200 shadow-md overflow-hidden sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}
