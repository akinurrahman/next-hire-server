import { z, TypeOf } from "zod";

export const createUserSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "Name is required",
      }),
      password: z
        .string({
          required_error: "Password is required",
        })
        .min(6, "min 6 char is required"),
      confirmPassword: z.string({
        required_error: "Confirm password is required",
      }),
      email: z
        .string({ required_error: "Email is required" })
        .email("Not a valid email"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Password do not match",
      path: ["confirmPassword"],
    }),
});

export type CreateUserInput = Omit<
  z.infer<typeof createUserSchema>["body"],
  "confirmPassword"
>;
