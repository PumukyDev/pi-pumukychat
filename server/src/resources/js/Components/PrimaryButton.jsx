export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={
                `px-4 py-2 text-sm font-semibold tracking-wide rounded-md
                bg-primary text-primary-content
                hover:bg-primary/90
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
                transition duration-150 ease-in-out ${
                    disabled ? 'opacity-25 cursor-not-allowed' : ''
                } ` + className
            }
        >
            {children}
        </button>
    );
}
