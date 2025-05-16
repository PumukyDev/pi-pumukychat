export default function PrimaryButton({ className = '', disabled, children, ...props }) {
    return (
        <button
            {...props}
            className={
                `btn btn-primary text-base-content font-semibold text-xs uppercase tracking-widest transition ease-in-out duration-150 ${
                    disabled ? 'opacity-25 cursor-not-allowed' : ''
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
