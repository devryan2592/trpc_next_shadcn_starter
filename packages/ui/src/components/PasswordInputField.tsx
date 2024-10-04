"use client";

import { ChangeEventHandler, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Eye, EyeOff } from "lucide-react";
import { FieldValues } from "react-hook-form";

interface PasswordInputFieldProps {
  field: FieldValues;
  placeholder?: string;
}

const PasswordInputField: React.FC<PasswordInputFieldProps> = ({
  field,
  placeholder,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      <Input
        {...field}
        placeholder={placeholder}
        type={showPassword ? "text" : "password"}
        className="pr-10"
        required
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full px-3"
        onClick={() => setShowPassword(!showPassword)}
      >
        {showPassword ? (
          <EyeOff className="h-4 w-4" />
        ) : (
          <Eye className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
};

export default PasswordInputField;
