import prisma from "@/lib/prisma";
import { createTRPCRouter, premiumProcedure, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { CredentialType } from "@/generated/prisma/enums";
import { encrypt } from "@/lib/encryption";
import { TRPCError } from "@trpc/server";

export const credentialsRouter = createTRPCRouter({
    create: premiumProcedure
    .input(
      z.object({
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // Type assertion - premiumProcedure guarantees auth exists
        const auth = ctx.auth!;
        const { name, value, type } = input;
  
        return await prisma.credential.create({
          data: {
            name: name,
            userId: auth.userId,
            type,
            value: encrypt(value),
          },
        });
      } catch (error) {
        console.error('Failed to create credential:', error);
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to create credential',
        });
      }
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      // Type assertion - protectedProcedure guarantees auth exists
      const auth = ctx.auth!;
      
      return prisma.credential.delete({
        where: {
          id: input.id,
          userId: auth.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        type: z.enum(CredentialType),
        value: z.string().min(1, "Value is required"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Type assertion - protectedProcedure guarantees auth exists
      const auth = ctx.auth!;
      const { id, name, type, value } = input;

      return prisma.credential.update({
        where: { 
          id, 
          userId: auth.userId 
        },
        data: {
          name,
          type,
          value: encrypt(value),
        },
      });
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      // Type assertion - protectedProcedure guarantees auth exists
      const auth = ctx.auth!;
      
      return prisma.credential.findUniqueOrThrow({
        where: {
          id: input.id,
          userId: auth.userId,
        },
      });
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      })
    )
    .query(async ({ ctx, input }) => {
      // Type assertion - protectedProcedure guarantees auth exists
      const auth = ctx.auth!;
      const { page, pageSize, search } = input;

      const [items, totalCount] = await Promise.all([
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: auth.userId,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.credential.count({
          where: {
            userId: auth.userId,
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        }),
      ]);

      const totalPages = Math.ceil(totalCount / pageSize);
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),

  getByType: protectedProcedure
    .input(
      z.object({
        type: z.enum(CredentialType),
      })
    )
    .query(({ input, ctx }) => {
      // Type assertion - protectedProcedure guarantees auth exists
      const auth = ctx.auth!;
      const { type } = input;

      return prisma.credential.findMany({
        where: {
          type,
          userId: auth.userId,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    }),
});