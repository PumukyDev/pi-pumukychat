export default function DangerButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `px-4 py-2 text-sm font-semibold tracking-wide rounded-md
                bg-error text-error-content
                hover:bg-error/90
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-error
                transition duration-150 ease-in-out ${
                    disabled ? 'opacity-25 cursor-not-allowed' : ''
                } ` + className
            }
        >
            {children}
        </button>
    );
}
