import type { RefObject } from "react";
import { NavLink } from "react-router";

import WarningImg from "../assets/logo/warning-icon.png";
import ProfileImg from "../assets/logo/profile.png";

interface IProfileContainer {
  username: string;
  password: string;

  editUsername: boolean;
  editPassword: boolean;
  isSaving: boolean;

  usernameRef: RefObject<HTMLInputElement | null>;
  passwordRef: RefObject<HTMLInputElement | null>;

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
  onUsernameChange,
  onPasswordChange,
  onEditUsername,
  onEditPassword,
  onSave,
}: IProfileContainer) {
  return (
    <div className="profile-container">
      {/* SUBSCRIPTION */}
      <div className="subscription">
        <div className="subscription-box">
          <div>
            <img src={WarningImg} alt="" id="subscription-img" />
            <div className="des-text">
              <span className="heading-4">
                Saat ini anda belum berlangganan
              </span>
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
            <img src={ProfileImg} alt="Foto profil" />
            <div className="img-input">
              <label
                htmlFor="upload-photo"
                className="upload-photo btn-unstyle"
              >
                Ubah Foto
              </label>
              <input type="file" accept="image/*" id="upload-photo" hidden />
              <span className="body-small-regular">&#128196; Maksimal 2MB</span>
            </div>
          </div>

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
          <div className="input-profile">
            <div>
              <label htmlFor="username">Email</label>
              <input type="text" name="email" id="email" readOnly />
            </div>

            <button
              type="button"
              onClick={onEditUsername}
              title="Edit nama pengguna"
            >
              &#128393;
            </button>
          </div>
          <div className="input-profile">
            <div>
              <label htmlFor="password">Kata Sandi</label>

              <input
                ref={passwordRef}
                type="password"
                name="password"
                id="password"
                value={password}
                readOnly={!editPassword}
                onChange={(e) => onPasswordChange(e.target.value)}
              />
            </div>
            <button
              type="button"
              onClick={onEditPassword}
              title="Edit kata sandi"
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
