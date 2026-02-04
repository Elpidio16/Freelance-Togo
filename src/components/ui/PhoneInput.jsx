export default function PhoneInput({
    label = "Numéro de téléphone",
    value,
    onChange,
    error,
    name = "phone",
    placeholder = "XX XX XX XX",
    required = false,
    className = '',
    ...props
}) {
    return (
        <div className="form-group">
            {label && (
                <label htmlFor={name} className="label">
                    {label}
                    {required && <span style={{ color: 'var(--accent-color)' }}> *</span>}
                </label>
            )}
            <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
            }}>
                {/* Togo Flag */}
                <div style={{
                    position: 'absolute',
                    left: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    pointerEvents: 'none',
                    zIndex: 1
                }}>
                    <span style={{ fontSize: '1.25rem' }}>🇹🇬</span>
                    <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>+228</span>
                </div>

                <input
                    id={name}
                    name={name}
                    type="tel"
                    className={`input ${error ? 'input-error' : ''} ${className}`}
                    style={{ paddingLeft: '5.5rem' }}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                />
            </div>
            {error && (
                <span className="text-sm" style={{
                    color: '#ef4444',
                    marginTop: '0.25rem',
                    display: 'block'
                }}>
                    {error}
                </span>
            )}
        </div>
    );
}
