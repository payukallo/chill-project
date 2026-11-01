export function usernameToAuthEmail(username: string) {
  const normalizedUsername = username.trim().toLowerCase();

  if (!/^[a-z0-9_]{3,20}$/.test(normalizedUsername)) {
    throw new Error(
      "Username harus 3-20 karakter dan hanya boleh menggunakan huruf, angka, atau underscore."
    );
  }

  return `${normalizedUsername}@chill-user.example.com`;
}