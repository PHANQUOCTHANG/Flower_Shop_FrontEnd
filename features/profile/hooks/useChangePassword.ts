"use client";

import { useMutation } from "@tanstack/react-query";
import { z, ZodIssue } from "zod";
import { profileService } from "@/features/profile/services/profileService";

// ─── Validation Schema ─────────────────────────────────────────────────────

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Mật khẩu hiện tại không được để trống")
      .min(8, "Mật khẩu hiện tại phải có ít nhất 8 ký tự"),

    newPassword: z
      .string()
      .min(8, "Mật khẩu mới phải có ít nhất 8 ký tự")
      .max(255, "Mật khẩu không được vượt quá 255 ký tự")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Mật khẩu phải chứa ít nhất: 1 chữ cái hoa, 1 chữ cái thường, 1 chữ số",
      ),

    confirmPassword: z.string().min(1, "Xác nhận mật khẩu không được để trống"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu mới và xác nhận mật khẩu không trùng khớp",
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: "Mật khẩu mới phải khác với mật khẩu hiện tại",
    path: ["newPassword"],
  });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type ValidationErrors = Record<string, string[]>;

// ─── Hook ─────────────────────────────────────────────────────────────────

export const useChangePassword = () => {
  return useMutation({
    mutationFn: async (data: ChangePasswordFormData) => {
      const validatedData = changePasswordSchema.parse(data);
      const response = await profileService.changePassword(validatedData);
      return response;
    },
  });
};

export const validateChangePassword = (
  formData: Partial<ChangePasswordFormData>,
): ValidationErrors => {
  try {
    changePasswordSchema.parse(formData);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: ValidationErrors = {};
      error.issues.forEach((err: ZodIssue) => {
        const path = err.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        errors[path].push(err.message);
      });
      return errors;
    }
    return { form: ["Lỗi xác thực không xác định"] };
  }
};
