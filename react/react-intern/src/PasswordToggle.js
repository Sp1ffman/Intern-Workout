import React, { useState } from "react";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-solid-svg-icons";
library.add(faUser, faEnvelope, faLock, faEye, faEyeSlash);

const usePasswordToggle = () => {
  const [showPassword, setShowPassword] = useState(false);
  const icon = (
    <FontAwesomeIcon
      icon={showPassword ? "eye-slash" : "eye"}
      onClick={() => setShowPassword((showPassword) => !showPassword)}
    />
  );
  const inputType = showPassword ? "text" : "password";
  return [inputType, icon];
};

export default usePasswordToggle;
