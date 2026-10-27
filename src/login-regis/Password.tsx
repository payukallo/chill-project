interface IPassword {
  paraPassword: String;
}

export function Password(props: IPassword) {
  const { paraPassword } = props;
  return (
    <div className="password body-large-medium">
      <label htmlFor="password">{paraPassword}</label>
      <input
        className="body-medium-regular"
        id="password"
        type="password"
        name="password"
        placeholder="Masukkan kata sandi"
        required
      />
    </div>
  );
}
