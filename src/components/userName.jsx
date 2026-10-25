export function UserName() {
  return (
    <div className="user-name body-large-medium">
      <label htmlFor="userName">Username</label>
      <input
        className="body-medium-regular"
        id="userName"
        type="text"
        name="userName"
        placeholder="Masukkan username"
        required
      />
    </div>
  );
}
