import { useState, type ChangeEvent, type RefObject } from "react";
import { Eye, EyeOff } from "lucide-react";
import { NavLink } from "react-router";
import WarningImg from "../assets/logo/warning-icon.png";
import type { IUserSubscription } from "../services/subscriptionService";
import { isSubscriptionActive } from "../services/subscriptionService";

interface IProfileContainer {
  username: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  profileImage: string;
  subscription: IUserSubscription | null;
  subscriptionLoading: boolean;
  subscriptionError: boolean;
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

export function ProfileContainer({
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
  subscription,
  subscriptionLoading,
  subscriptionError,
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
}: IProfileContainer) {
  const isPremiumActive = isSubscriptionActive(subscription);
  const subscriptionEndDate = subscription
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(subscription.end_date))
    : "";

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  return (
    <div className="profile-container">
      <div className="subscription">
        {subscriptionLoading ? (
          <div className="subscription-box">
            <p>Memeriksa status langganan...</p>
          </div>
        ) : subscriptionError ? (
          <div className="subscription-box">
            <p>Gagal memuat status langganan. Coba muat ulang halaman.</p>
          </div>
        ) : isPremiumActive && subscription ? (
          <div className="subscription-box premium-card">
            <span className="subscription-premium-badge body-medium-bold">
              Aktif
            </span>
            <div>
              <p className="heading-4">
                Akun Premium {subscription.package_name}✨
              </p>
              <p className="body-large-regular">
                Saat ini kamu sedang menggunakan akses akun premium
              </p>
            </div>

            <p className="body-medium-medium">
              Berlaku hingga {subscriptionEndDate}
            </p>
          </div>
        ) : (
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
              <NavLink to="/subscription" className="body-medium-bold">
                {subscription?.status === "pending"
                  ? "Lanjutkan Pembayaran"
                  : "Mulai Berlangganan"}
              </NavLink>
            </div>
          </div>
        )}
      </div>

      <div className="user-update">
        <span className="heading-3">Profil Saya</span>

        <div className="user-data body-medium-semiBold">
          {/* Foto Profil */}
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

          {/* Password Lama */}
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

          {/* Password Baru */}
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
        <div className="save-button">
          {/* Tombol Simpan Profil */}
          <button
            className="user-update-btn btn-unstyle body-medium-bold"
            type="button"
            onClick={onSaveProfile}
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Simpan Profil"}
          </button>

          {/* Tombol Ubah Password */}
          <button
            className="user-update-btn btn-unstyle body-medium-bold"
            type="button"
            onClick={onChangePassword}
            disabled={isSaving}
          >
            {isSaving ? "Menyimpan..." : "Ubah Kata Sandi"}
          </button>
        </div>
      </div>
    </div>
  );
}
