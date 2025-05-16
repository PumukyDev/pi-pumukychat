export default function SecondaryButton({ type = 'button', className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            type={type}
            className={
                `btn btn-secondary text-base-content font-semibold text-xs uppercase tracking-widest shadow-sm transition ease-in-out duration-150 ${
                    disabled ? 'opacity-25 cursor-not-allowed' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
