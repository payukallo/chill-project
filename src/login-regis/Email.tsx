interface IEmail {
  autoComplete: string;
}

export function Email({ autoComplete }: IEmail) {
  return (
    <div className="user-name body-large-medium">
      <label htmlFor="email">Email</label>
      <input
        className="body-medium-regular"
        id="email"
        type="email"
        name="email"
        placeholder="Masukkan email"
        required
        autoComplete={autoComplete}
      />
    </div>
  );
}
