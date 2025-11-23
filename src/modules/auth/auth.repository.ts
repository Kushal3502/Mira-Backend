import { User } from "./auth.model";

export const AuthRepository = {
  findByEmail: (email: string) => {
    return User.findOne({ email });
  },

  findById: (id: string) => {
    return User.findById(id);
  },

  create: (payload: any) => {
    return User.create(payload);
  },

  findByResetToken: (userId: string, token: string) => {
    return User.findOne({
      _id: userId,
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
  },

  updateRefreshToken: (id: string, refreshToken: string | undefined) => {
    return User.findByIdAndUpdate(
      id,
      { $set: { refreshToken } },
      { new: true }
    );
  },

  updatePassword: (id: string, hashedPassword: string) => {
    return User.findByIdAndUpdate(
      id,
      {
        $set: {
          password: hashedPassword,
          resetPasswordToken: undefined,
          resetPasswordExpiresAt: undefined,
        },
      },
      { new: true }
    );
  },

  saveUser: (user: any) => user.save(),
};
