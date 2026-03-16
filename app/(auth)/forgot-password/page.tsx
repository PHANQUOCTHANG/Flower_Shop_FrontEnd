"use client";

import React from "react";
import { Flower2 } from "lucide-react";
import { useForgotPassword } from "@/features/auth/forgot-password/hooks/useForgotPassword";
import Alert from "@/components/ui/Alert";
import {
  Stepper,
  EmailStep,
  OtpStep,
  ResetPasswordStep,
  SuccessStep,
  BackButton,
} from "@/features/auth/forgot-password/components";

export default function ForgotPasswordPage() {
  const {
    step,
    email,
    otp,
    newPassword,
    confirmPassword,
    showPassword,
    timer,
    isSubmitting,
    error,
    passwordStrength,

    setEmail,
    setOtp,
    setNewPassword,
    setConfirmPassword,
    toggleShowPassword,
    resendOtp,

    handleRequestOtp,
    handleVerifyOtp,
    handleResetPassword,
    goBack,
  } = useForgotPassword();

  const [showAlert, setShowAlert] = React.useState(true);

  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    setShowAlert(true);
  };

  const handlePasswordChange = (newPassword: string) => {
    setNewPassword(newPassword);
    setShowAlert(true);
  };

  const handleConfirmPasswordChange = (newConfirmPassword: string) => {
    setConfirmPassword(newConfirmPassword);
    setShowAlert(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f6f6] dark:bg-[#221015] font-['Inter',sans-serif] text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <main className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        {/* Hiệu ứng nền */}
        <div className="absolute top-1/4 -left-20 size-96 bg-[#ee2b5b]/5 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-1/4 -right-20 size-96 bg-[#ee2b5b]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-[480px] bg-white dark:bg-[#1a0c10] rounded-[2.5rem] shadow-2xl shadow-[#ee2b5b]/5 p-8 md:p-12 border border-[#ee2b5b]/10 relative z-10 animate-in fade-in zoom-in-95 duration-500">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="bg-[#ee2b5b]/10 p-2.5 rounded-2xl text-[#ee2b5b]">
              <Flower2 size={32} />
            </div>
          </div>

          {/* Stepper */}
          {step !== "success" && <Stepper currentStep={step} />}

          {/* Error Alert */}
          {error && showAlert && (
            <div className="mb-6">
              <Alert
                type="error"
                message={error.message}
                autoClose={true}
                duration={5000}
                onClose={() => setShowAlert(false)}
              />
            </div>
          )}

          {/* Step Components */}
          {step === "email" && (
            <EmailStep
              email={email}
              isSubmitting={isSubmitting}
              onEmailChange={handleEmailChange}
              onSubmit={handleRequestOtp}
            />
          )}

          {step === "otp" && (
            <OtpStep
              email={email}
              otp={otp}
              timer={timer}
              isSubmitting={isSubmitting}
              onOtpChange={setOtp}
              onVerify={handleVerifyOtp}
              onResendOtp={resendOtp}
            />
          )}

          {step === "reset" && (
            <ResetPasswordStep
              newPassword={newPassword}
              confirmPassword={confirmPassword}
              showPassword={showPassword}
              isSubmitting={isSubmitting}
              passwordStrength={passwordStrength}
              onNewPasswordChange={handlePasswordChange}
              onConfirmPasswordChange={handleConfirmPasswordChange}
              onToggleShowPassword={toggleShowPassword}
              onSubmit={handleResetPassword}
            />
          )}

          {step === "success" && <SuccessStep />}

          {/* Back Button */}
          <BackButton step={step} isSubmitting={isSubmitting} onBack={goBack} />
        </div>
      </main>

      {/* Footer */}
      <footer className="py-10 border-t border-[#ee2b5b]/5 text-center opacity-60 shrink-0">
        <p className="text-xs text-slate-400 font-medium italic tracking-wide text-[10px] uppercase">
          © 2024 Flower Shop • Trao gửi yêu thương qua từng cánh hoa.
        </p>
      </footer>
    </div>
  );
}
