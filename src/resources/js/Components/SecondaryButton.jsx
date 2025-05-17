export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            disabled={disabled}
            className={
                `px-4 py-2 text-sm font-semibold tracking-wide rounded-md
                bg-base-300 text-base-content
                hover:bg-base-300/80
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-base-300
                transition duration-150 ease-in-out ${
                    disabled ? 'opacity-25 cursor-not-allowed' : ''
                } ` + className
            }
        >
            {children}
        </button>
    );
}
