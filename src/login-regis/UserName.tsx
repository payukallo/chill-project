interface IUserName {
  autoComplete: string;
}

export function UserName(props:IUserName) {
  const {autoComplete} = props
  return (
    <div className="user-name body-large-medium">
      <label htmlFor="userName">Username</label>
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
