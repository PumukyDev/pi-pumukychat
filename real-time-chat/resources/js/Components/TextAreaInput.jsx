import { forwardRef, useEffect, useRef } from 'react';

export default forwardRef(function TextAreaInput({ className = '', isFocused = false, ...props }, ref) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <textarea
            {...props}
            className={
                'bg-base-200 text-base-content border border-base-300 focus:border-primary focus:ring-primary rounded-md shadow-sm ' +
                className
            }
            ref={input}
        ></textarea>
    );
});
