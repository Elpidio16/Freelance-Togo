export default function Badge({
    children,
    variant = 'default',
    className = '',
    ...props
}) {
    const baseClasses = 'badge';
    const variantClass = variant !== 'default' ? `badge-${variant}` : '';

    const classes = [baseClasses, variantClass, className]
        .filter(Boolean)
        .join(' ');

    return (
        <span className={classes} {...props}>
            {children}
        </span>
    );
}
