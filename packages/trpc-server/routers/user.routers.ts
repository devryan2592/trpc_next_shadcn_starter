import { privateProcedure, router } from "../trpc";

export const userRoutes = router({
  getUser: privateProcedure.query(async ({ ctx }) => {
    const { user } = ctx;

    return user;
  }),
});
