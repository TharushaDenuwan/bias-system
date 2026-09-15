import { betterAuth } from "better-auth";

export const auth = betterAuth({
  user: {
    changeEmail: {
      enabled: true,
    },
    deleteUser: {
      enabled: true,
    },
  },
});
