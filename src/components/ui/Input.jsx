export default function Input({
    label,
    error,
    className = '',
    id,
    required = false,
    ...props
}) {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
        <div className="form-group">
            {label && (
                <label htmlFor={inputId} className="label">
                    {label}
                    {required && <span style={{ color: 'var(--accent-color)' }}> *</span>}
                </label>
            )}
            <input
                id={inputId}
                className={`input ${error ? 'input-error' : ''} ${className}`}
                {...props}
            />
            {error && <span className="text-sm" style={{ color: '#ef4444', marginTop: '0.25rem', display: 'block' }}>{error}</span>}
        </div>
    );
}
