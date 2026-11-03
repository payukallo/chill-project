import type { ChangeEvent, RefObject } from "react";
import { NavLink } from "react-router";
import WarningImg from "../assets/logo/warning-icon.png";

interface IProfileContainer {
  username: string;
  password: string;
  profileImage: string;
  editUsername: boolean;
  editPassword: boolean;
  isSaving: boolean;

  usernameRef: RefObject<HTMLInputElement | null>;
  passwordRef: RefObject<HTMLInputElement | null>;

  onPhotoChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onUsernameChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onEditUsername: () => void;
  onEditPassword: () => void;
  onSave: () => void;
}

export function ProfileContainer({
  username,
  password,
  editUsername,
  editPassword,
  isSaving,
  usernameRef,
  passwordRef,
  profileImage,
  onPhotoChange,
  onUsernameChange,
  onPasswordChange,
  onEditUsername,
  onEditPassword,
  onSave,
}: IProfileContainer) {
  return (
    <div className="profile-container">
      <div className="subscription">
        <div className="subscription-box">
          <div>
            <img src={WarningImg} alt="" id="subscription-img" />
            <div className="des-text">
              <span className="heading-4 span-subscription"></span>
              <p className="body-large-regular">
                Dapatkan Akses Tak Terbatas ke Ribuan Film dan Series Kesukaan
                Kamu!
              </p>
            </div>
          </div>
          <div className="navlink">
            <NavLink to="/" className="body-medium-bold">
              Mulai Berlangganan
            </NavLink>
          </div>
        </div>
      </div>
      <div className="user-update">
        <span className="heading-3">Profil Saya</span>
        <div className="user-data body-medium-semiBold">
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

          {/* Username */}
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

          {/* Email */}
          <div className="input-profile">
            <div>
              <label htmlFor="email">Email</label>
              <input type="email" name="email" id="email" readOnly />
            </div>
          </div>

          {/* Password */}
          <div className="input-profile">
            <div>
              <label htmlFor="password">Kata Sandi Baru</label>
              <input
                ref={passwordRef}
                type="password"
                name="password"
                id="password"
                value={password}
                placeholder="Masukkan kata sandi baru"
                readOnly={!editPassword}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
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
        <button
          className="user-update-btn btn-unstyle body-medium-bold"
          type="button"
          onClick={onSave}
          disabled={isSaving}
        >
          {isSaving ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}
