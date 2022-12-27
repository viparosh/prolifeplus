export const fieldText = (
  newError,
  label,
  id,
  ref,
  defaultValue,
  type = 'text',
  disabled,
  handler
) => {
  return (
    <div className="mt-4 w-full">
      {newError && <span className="text-sm text-red-600">{newError}</span>}
      {label && (
        <label htmlFor={id} className="block text-secondaryText">
          {label}
        </label>
      )}
      {disabled ? (
        <input
          disabled={disabled}
          type={type}
          value={defaultValue}
          id={id}
          className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
        />
      ) : (
        <input
          ref={ref}
          disabled={disabled}
          type={type}
          defaultValue={defaultValue}
          id={id}
          className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
        />
      )}
    </div>
  )
}

export const fieldSelect = (
  newError,
  label,
  id,
  ref,
  obj,
  defaultValue,
  disabled,
  handler
) => {
  return (
    <div className="mt-4 w-full">
      {newError && <span className="text-sm text-red-600">{newError}</span>}
      <label htmlFor={id} className="block text-secondaryText">
        {label}
      </label>
      {handler?.event ? (
        <select
          onChange={handler.func}
          disabled={disabled}
          ref={ref}
          value={defaultValue || undefined}
          id={id}
          className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
        >
          {obj.map(({ name, value }) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
      ) : (
        <select
          disabled={disabled}
          ref={ref}
          defaultValue={defaultValue}
          id={id}
          className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
        >
          {obj.map(({ name, value }) => (
            <option key={value} value={value} selected={value == defaultValue}>
              {name}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
export const fieldTextarea = (
  newError,
  label,
  id,
  ref,
  defaultValue,
  disabled
) => {
  return (
    <div className="mt-4 w-full lg:mr-4">
      <span className="text-sm text-red-600">{newError}</span>
      <label htmlFor={id} className="block text-secondaryText">
        {label}
      </label>
      {disabled ? (
        <textarea
          disabled={disabled}
          ref={ref}
          id={id}
          value={defaultValue}
          className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
        />
      ) : (
        <textarea
          disabled={disabled}
          ref={ref}
          id={id}
          defaultValue={label == "Reason:" ? "Time overlaps" : defaultValue}
          className="mt-2 block w-full rounded-md border border-inputBorder px-3 py-2"
        />
      )}
    </div>
  )
}
