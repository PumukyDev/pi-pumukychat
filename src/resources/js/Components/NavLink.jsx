import { Link } from '@inertiajs/react';

export default function NavLink({ active = false, className = '', children, ...props }) {
    return (
        <Link
            {...props}
            className={
                'inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none ' +
                (active
                    ? 'border-base-content text-base-content'
                    : 'border-transparent text-base-content/60 hover:text-base-content hover:border-base-300 focus:border-base-300') +
                ' ' + className
            }
        >
            {children}
        </Link>
    );
}
