interface IPassword {
  paraPassword: string;
  inputName: string;
}


export function Password({ paraPassword, inputName }: IPassword) {
  return (
    <div className="password body-large-medium">
      <label >{paraPassword}</label>
      <input
        className="body-medium-regular"
        id="password"
        type="password"
        name={inputName}
        placeholder={paraPassword}
        required
      />
    </div>
  );
}
