const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const supabase = require("../config/supabase");
const path = require("path");

const register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // 1. Pastikan semua data tersedia
    if (!username || !email || !password) {
      return res.status(400).json({
        message: "Username, email, dan password wajib diisi",
      });
    }

    // 2. Pastikan input berupa string
    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string"
    ) {
      return res.status(400).json({
        message: "Format data tidak valid",
      });
    }

    // 3. Bersihkan username dan email
    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    // 4. Validasi username
    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      return res.status(400).json({
        message: "Username harus terdiri dari 3-50 karakter",
      });
    }

    // 5. Validasi email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        message: "Format email tidak valid",
      });
    }

    // 6. Validasi password
    if (password.length < 8 || password.length > 72) {
      return res.status(400).json({
        message: "Password harus terdiri dari 8-72 karakter",
      });
    }

    // 7. Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 8. Simpan pengguna
    const result = await userModel.createUser(
      cleanUsername,
      cleanEmail,
      hashedPassword,
    );

    res.status(201).json({
      message: "Registrasi berhasil",
      userId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    // 1. Ambil username dan password
    const { username, password } = req.body;

    // 2. Validasi input
    if (!username || !password) {
      return res.status(400).json({
        message: "Username dan password wajib diisi",
      });
    }

    // 3. Cari pengguna berdasarkan username
    const cleanUsername = username.trim().toLowerCase();
    const user = await userModel.findUserByUsername(cleanUsername);

    if (!user) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    // 4. Cocokkan password dengan hash di database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "Username atau password salah",
      });
    }

    // 5. Tingkatkan versi sesi setelah login berhasil
    const sessionVersion = await userModel.incrementSessionVersion(user.id);

    // 6. Buat JWT dengan versi sesi terbaru
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role,
        session_version: sessionVersion,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRES_IN || "1d",
      },
    );

    // 6. Mengirim token dan informasi pengguna
    res.status(200).json({
      message: "Login berhasil",
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const user = await userModel.findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Pengguna tidak ditemukan",
      });
    }

    res.status(200).json({
      status: "success",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const { username, email } = req.body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      !username.trim() ||
      !email.trim()
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Username dan email wajib diisi",
      });
    }

    const cleanUsername = username.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanUsername.length < 3 || cleanUsername.length > 50) {
      return res.status(400).json({
        status: "fail",
        message: "Username harus terdiri dari 3 sampai 50 karakter",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        status: "fail",
        message: "Format email tidak valid",
      });
    }

    await userModel.updateUser(req.user.id, cleanUsername, cleanEmail);

    const updatedUser = await userModel.findUserById(req.user.id);

    res.status(200).json({
      status: "success",
      message: "Profil berhasil diperbarui",
      user: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    // 1. Validasi input
    if (
      typeof oldPassword !== "string" ||
      typeof newPassword !== "string" ||
      !oldPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        status: "fail",
        message: "Password lama dan password baru wajib diisi",
      });
    }

    // 2. Validasi panjang password baru
    if (newPassword.length < 8 || newPassword.length > 72) {
      return res.status(400).json({
        status: "fail",
        message: "Password baru harus terdiri dari 8-72 karakter",
      });
    }

    // 3. Ambil data pengguna beserta hash password
    const user = await userModel.findUserWithPassword(req.user.id);

    if (!user) {
      return res.status(404).json({
        status: "fail",
        message: "Pengguna tidak ditemukan",
      });
    }

    // 4. Periksa password lama
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        status: "fail",
        message: "Password lama tidak benar",
      });
    }

    // 5. Hash password baru
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // 6. Simpan password baru
    await userModel.updatePassword(req.user.id, hashedPassword);

    res.status(200).json({
      status: "success",
      message: "Password berhasil diperbarui",
    });
  } catch (error) {
    next(error);
  }
};

const uploadProfileImage = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        status: "fail",
        message: "Silakan pilih foto profil terlebih dahulu.",
      });
    }

    // Tentukan ekstensi file
    const extension = path.extname(file.originalname).toLowerCase();

    const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

    if (!allowedExtensions.includes(extension)) {
      return res.status(400).json({
        status: "fail",
        message: "Format foto harus JPG, JPEG, PNG, atau WEBP.",
      });
    }

    // Buat lokasi penyimpanan berdasarkan ID pengguna
    const filePath = `${userId}/avatar${extension}`;

    // Upload foto ke Supabase Storage
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, file.buffer, {
        upsert: true,
        contentType: file.mimetype,
      });

    if (uploadError) {
      throw uploadError;
    }

    // Ambil URL foto
    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);

    const avatarUrl = publicUrlData.publicUrl;

    // Simpan URL ke MySQL
    await userModel.updateAvatarUrl(userId, avatarUrl);

    res.status(200).json({
      status: "success",
      message: "Foto profil berhasil diperbarui.",
      avatar_url: avatarUrl,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfileImage,
};
