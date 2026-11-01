interface IUserName {
  autoComplete: string;
}

export function UserName({ autoComplete }: IUserName) {
  return (
    <div className="user-name body-large-medium">
      <label htmlFor="username">Username</label>
      <input
        className="body-medium-regular"
        id="username"
        type="text"
        name="username"
        placeholder="Masukkan username"
        required
        autoComplete={autoComplete}
      />
    </div>
  );
}