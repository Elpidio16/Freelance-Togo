export default function Card({
    children,
    className = '',
    hover = true,
    onClick,
    ...props
}) {
    const classes = `card ${hover ? '' : 'no-hover'} ${className}`;

    return (
        <div className={classes} onClick={onClick} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children, className = '' }) {
    return <div className={`card-header ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = '' }) {
    return <h3 className={`card-title ${className}`}>{children}</h3>;
}

export function CardDescription({ children, className = '' }) {
    return <p className={`card-description ${className}`}>{children}</p>;
}
