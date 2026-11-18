import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface IPassword {
  paraPassword: string;
  inputName: string;
}

export function Password({ paraPassword, inputName }: IPassword) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password body-large-medium">
      <label htmlFor={inputName}>{paraPassword}</label>

      <div className="password-input-wrapper">
        <input
          className="body-medium-regular"
          id={inputName}
          type={showPassword ? "text" : "password"}
          name={inputName}
          placeholder={paraPassword}
          required
        />

        <button
          type="button"
          className="password-toggle"
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={
            showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
          }
          aria-pressed={showPassword}
        >
          {showPassword ? <Eye size={22} /> : <EyeOff size={22} />}
        </button>
      </div>
    </div>
  );
}
