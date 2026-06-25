import React from 'react';
import './Button.css'

const Button = ({
    children,
    variant = 'default',
    size = 'default',
    className = '',
    asChild = false,
    ...props
}) => {

    const variants = {
        default: 'btn-primary-custom shadow-soft',
        outline: 'btn-outline-custom',
        secondary: 'btn-secondary-custom',
        ghost: 'btn-ghost-custom',
        destructive: 'btn-destructive-custom',
        link: 'btn-link-custom'
    }

    const sizes = {
        default: 'px-4 py-2',
        sm: 'btn-sm px-3',
        lg: 'btn-lg px-5 py-3',
        icon: 'btn-icon',
    }

    const baseClasses = 'btn d-inline-flex align-items-center justify-content-center gap-2 fw-medium transition-all rounded-pill';

    const finalClassName = `${baseClasses} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`;


    if (asChild && React.isValidElement(children)) {
        return React.cloneElement(children, {
            className: `${finalClassName} ${children.props.className || ''}`,
            ...props
        });
    }


    return (
        <button className={finalClassName} {...props}>
            {children}
        </button>
    );
};

export default Button;