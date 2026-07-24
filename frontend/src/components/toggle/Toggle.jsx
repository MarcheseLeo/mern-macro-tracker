import './Toggle.css'

export const Toggle = ({ onChange, checked, disabled = false }) => {
    return (
        <label className={`switch ${disabled ? 'switch-disabled' : ''}`}>
            <input
                type="checkbox"
                onChange={(e) => onChange(e.target.checked)}
                checked={checked}
                disabled={disabled}
            />
            <span className="slider"></span>
        </label>
    )
}
