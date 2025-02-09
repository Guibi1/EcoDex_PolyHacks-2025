import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
    getUser: publicProcedure.query(async ({ ctx }) => {
        return ctx.user;
    }),
});
