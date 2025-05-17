export default function Checkbox({ className = '', ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'checkbox bg-base-100 border-base-300 text-primary focus:ring-primary ' +
                className
            }
        />
    );
}
