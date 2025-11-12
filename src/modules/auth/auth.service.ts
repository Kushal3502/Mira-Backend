import { User } from "./auth.model";

export const findUserByEmail = async (email: string) => {
  return await User.findOne({ email });
};

export const createUser = async (payload: Object) => {
  return await User.create(payload);
};

export const findUserById = async (userId: String) => {
  return await User.findById(userId);
};

export const findUserByResetToken = async (resetPasswordToken: string) => {
  return await User.findOne({
    resetPasswordToken,
    resetPasswordExpiresAt: { $gt: Date.now() },
  });
};
