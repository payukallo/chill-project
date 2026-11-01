interface IPassword {
  paraPassword: string;
  inputName: string;
}

export function Password({ paraPassword, inputName }: IPassword) {
  return (
    <div className="password body-large-medium">
      <label htmlFor={inputName}>{paraPassword}</label>

      <input
        className="body-medium-regular"
        id={inputName}
        type="password"
        name={inputName}
        placeholder={paraPassword}
        required
      />
    </div>
  );
}