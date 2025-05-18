"use client";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/hooks/useAuth";
import { EyeCloseIcon, EyeIcon } from "@/icons";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { notification } from "antd";

export default function SignInForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
  // Function to get a specific cookie value
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return undefined;
  };
  
  const isTokenExpired = getCookie('isTokenExpires');
  console.log('isTokenExpired', isTokenExpired);
  
  if (isTokenExpired === 'true') {
    notification.warning({
      placement: "topRight",
      message: "Phiên đăng nhập đã hết hạn",
      style: { zIndex: 1000 }
    });
    
    document.cookie = 'isTokenExpires=; Max-Age=0; path=/;';
  }
}, [])


  const handleLogin = async () => {
    if (!email || !password) {
      console.log('Vui lòng nhập email và mật khẩu');
      return;
    }

    setIsLoading(true);

    const success = await login(email, password);
    setIsLoading(false);

    if (success) {
      notification.success({
        placement: "topRight",
        message: "Đăng nhập thành công",
      });
      router.push('/');
    } else {
      notification.error({
        placement: "topRight",
        message: "Thông tin đăng nhập không chính xác",
      })
    }
  }

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enter your email and password to sign in!
            </p>
          </div>
          <div>
            <div>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{" "}
                  </Label>
                  <Input defaultValue={email} onChange={(e) => setEmail(e.target.value)} placeholder="info@gmail.com" type="email" />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{" "}
                  </Label>
                  <div className="relative">
                    <Input
                      defaultValue={password}
                      onChange={(e) => setPassword(e.target.value)}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      onKeyUp={(e) => {
                        if (e.key === "Enter") {
                          handleLogin();
                        }
                      }}
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                      )}
                    </span>
                  </div>
                </div>
                <div>
                  <Button loading={isLoading} onClick={handleLogin} className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
