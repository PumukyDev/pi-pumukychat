import { Link } from '@inertiajs/react';

export default function ResponsiveNavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={`w-full flex items-start ps-3 pe-4 py-2 border-l-4 transition duration-150 ease-in-out text-base font-medium focus:outline-none ${
                active
                    ? 'border-primary bg-base-300 text-primary'
                    : 'border-transparent text-base-content hover:bg-base-200 hover:border-base-300'
            } ${className}`}
        >
            {children}
        </Link>
    );
}
