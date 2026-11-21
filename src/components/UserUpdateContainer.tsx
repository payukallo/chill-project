import { useState } from "react";
import type { ChangeEvent, RefObject } from "react";
import { Eye, EyeOff } from "lucide-react";

export interface IUserUpdateContainer {
  username: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  profileImage: string;

  editUsername: boolean;
  editEmail: boolean;
  editOldPassword: boolean;
  editPassword: boolean;
  isSaving: boolean;

  usernameRef: RefObject<HTMLInputElement | null>;
  emailRef: RefObject<HTMLInputElement | null>;
  oldPasswordRef: RefObject<HTMLInputElement | null>;
  newPasswordRef: RefObject<HTMLInputElement | null>;

  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUsernameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onOldPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;

  onEditUsername: () => void;
  onEditEmail: () => void;
  onEditOldPassword: () => void;
  onEditPassword: () => void;
  onSaveProfile: () => void;
  onChangePassword: () => void;
}

export function UserUpdateContainer({
  username,
  email,
  oldPassword,
  newPassword,
  profileImage,
  editUsername,
  editEmail,
  editOldPassword,
  editPassword,
  isSaving,
  usernameRef,
  emailRef,
  oldPasswordRef,
  newPasswordRef,
  onPhotoChange,
  onUsernameChange,
  onEmailChange,
  onOldPasswordChange,
  onNewPasswordChange,
  onEditUsername,
  onEditEmail,
  onEditOldPassword,
  onEditPassword,
  onSaveProfile,
  onChangePassword,
}: IUserUpdateContainer) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="user-update">
      <span className="heading-3">Profil Saya</span>

      <div className="user-data body-medium-semiBold">
        {/* FOTO PROFIL */}
        <div className="user-img">
          <img src={profileImage} alt="Foto profil" />

          <div className="img-input">
            <label htmlFor="upload-photo" className="upload-photo">
              Ubah Foto
            </label>

            <input
              type="file"
              accept="image/*"
              id="upload-photo"
              onChange={onPhotoChange}
              hidden
            />

            <span className="body-small-regular">&#128196; Maksimal 2MB</span>
          </div>
        </div>

        {/* USERNAME */}
        <div className="input-profile">
          <div>
            <label htmlFor="username">Nama Pengguna</label>

            <input
              ref={usernameRef}
              type="text"
              name="username"
              id="username"
              value={username}
              readOnly={!editUsername}
              onChange={(e) => onUsernameChange(e.target.value)}
            />
          </div>

          <button
            type="button"
            onClick={onEditUsername}
            title="Edit nama pengguna"
          >
            &#128393;
          </button>
        </div>

        {/* EMAIL */}
        <div className="input-profile">
          <div>
            <label htmlFor="email">Email</label>

            <input
              ref={emailRef}
              type="email"
              name="email"
              id="email"
              value={email}
              readOnly={!editEmail}
              onChange={(e) => onEmailChange(e.target.value)}
            />
          </div>

          <button type="button" onClick={onEditEmail} title="Edit email">
            &#128393;
          </button>
        </div>

        {/* PASSWORD LAMA */}
        <div className="input-profile">
          <div>
            <label htmlFor="old-password">Kata Sandi Lama</label>

            <div className="profile-password-wrapper">
              <input
                ref={oldPasswordRef}
                type={showOldPassword ? "text" : "password"}
                name="oldPassword"
                id="old-password"
                value={oldPassword}
                placeholder="Masukkan kata sandi lama"
                readOnly={!editOldPassword}
                onChange={(e) => onOldPasswordChange(e.target.value)}
              />

              <button
                type="button"
                className="profile-password-toggle"
                onClick={() => setShowOldPassword((prev) => !prev)}
                aria-label={
                  showOldPassword
                    ? "Sembunyikan kata sandi lama"
                    : "Tampilkan kata sandi lama"
                }
                aria-pressed={showOldPassword}
              >
                {showOldPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditOldPassword}
            title="Edit kata sandi lama"
          >
            &#128393;
          </button>
        </div>

        {/* PASSWORD BARU */}
        <div className="input-profile">
          <div>
            <label htmlFor="new-password">Kata Sandi Baru</label>

            <div className="profile-password-wrapper">
              <input
                ref={newPasswordRef}
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                id="new-password"
                value={newPassword}
                placeholder="Masukkan kata sandi baru"
                readOnly={!editPassword}
                onChange={(e) => onNewPasswordChange(e.target.value)}
              />

              <button
                type="button"
                className="profile-password-toggle"
                onClick={() => setShowNewPassword((prev) => !prev)}
                aria-label={
                  showNewPassword
                    ? "Sembunyikan kata sandi baru"
                    : "Tampilkan kata sandi baru"
                }
                aria-pressed={showNewPassword}
              >
                {showNewPassword ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={onEditPassword}
            title="Ubah kata sandi"
          >
            &#128393;
          </button>
        </div>
      </div>

      {/* TOMBOL SIMPAN */}
      <div className="save-button">
        <button
          className="user-update-btn body-medium-bold"
          type="button"
          onClick={onSaveProfile}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan Profil"}
        </button>

        <button
          className="user-update-btn body-medium-bold"
          type="button"
          onClick={onChangePassword}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Ubah Kata Sandi"}
        </button>
      </div>
    </div>
  );
}
