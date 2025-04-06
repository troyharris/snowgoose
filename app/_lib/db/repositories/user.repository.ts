import { User } from "@prisma/client";
import { BaseRepository } from "./base.repository";

export class UserRepository extends BaseRepository {
  async findAll(): Promise<User[]> {
    try {
      //console.log("Repository getting users");
      return await this.prisma.user.findMany({
        orderBy: {
          id: "asc",
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findById(id: number): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { id },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { username: username },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByAuthId(authId: string): Promise<User | null> {
    try {
      return await this.prisma.user.findUnique({
        where: { authId: authId },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    try {
      return await this.prisma.user.findFirst({
        where: { email },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async create(data: {
    username: string;
    //password: string;
    email?: string;
    isAdmin?: boolean;
    periodUsage?: number;
    totalUsage?: number;
    authId: string;
  }): Promise<User> {
    try {
      return await this.prisma.user.create({
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async update(
    id: number,
    data: {
      username?: string;
      email?: string;
      isAdmin?: boolean;
      periodUsage?: number;
      totalUsage?: number;
      authId?: string;
    }
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  async updateSubscriptionByAuthId(
    authId: string,
    data: {
      stripeCustomerId: string;
      stripeSubscriptionId: string;
      stripePriceId?: string | null; // Make optional as it might not always be present or needed
      stripeCurrentPeriodBegin: Date;
      stripeCurrentPeriodEnd: Date;
      stripeSubscriptionStartDate: Date;
      // Optionally reset usage here if needed
      // periodUsage?: number;
    }
  ): Promise<User> {
    try {
      return await this.prisma.user.update({
        where: { authId: authId },
        data: {
          stripeCustomerId: data.stripeCustomerId,
          stripeSubscriptionId: data.stripeSubscriptionId,
          stripePriceId: data.stripePriceId,
          stripeCurrentPeriodBegin: data.stripeCurrentPeriodBegin,
          stripeCurrentPeriodEnd: data.stripeCurrentPeriodEnd,
          stripeSubscriptionStartDate: data.stripeSubscriptionStartDate,
          // periodUsage: data.periodUsage !== undefined ? data.periodUsage : undefined, // Example if resetting usage
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Updates subscription details for a user identified by their Stripe Customer ID.
   * Used for webhook events like 'customer.subscription.updated'.
   */
  async updateSubscriptionByCustomerId(
    stripeCustomerId: string,
    data: {
      stripeSubscriptionId: string;
      stripePriceId?: string | null;
      stripeCurrentPeriodBegin: Date;
      stripeCurrentPeriodEnd: Date;
      // stripeSubscriptionStartDate is usually set only on creation,
      // but could be updated if needed, though less common.
      // periodUsage?: number; // Optionally reset usage here if needed
    }
  ): Promise<User | null> {
    // Find the user first to ensure they exist with this customer ID
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId },
    });

    if (!user) {
      console.warn(
        `UserRepository: No user found with stripeCustomerId: ${stripeCustomerId}. Cannot update subscription.`
      );
      // Depending on strictness, you might throw an error or just return null
      // throw new Error(`No user found with stripeCustomerId: ${stripeCustomerId}`);
      return null;
    }

    try {
      return await this.prisma.user.update({
        where: { id: user.id }, // Update using the found user's primary key
        data: {
          // stripeCustomerId should already match, no need to update it here
          stripeSubscriptionId: data.stripeSubscriptionId,
          stripePriceId: data.stripePriceId,
          stripeCurrentPeriodBegin: data.stripeCurrentPeriodBegin,
          stripeCurrentPeriodEnd: data.stripeCurrentPeriodEnd,
          // periodUsage: data.periodUsage !== undefined ? data.periodUsage : undefined,
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }

  /**
   * Clears Stripe subscription details for a user identified by their Stripe Customer ID.
   * Used for webhook events like 'customer.subscription.deleted'.
   */
  async clearSubscriptionByCustomerId(
    stripeCustomerId: string
  ): Promise<User | null> {
    // Find the user first
    const user = await this.prisma.user.findFirst({
      where: { stripeCustomerId },
    });

    if (!user) {
      console.warn(
        `UserRepository: No user found with stripeCustomerId: ${stripeCustomerId}. Cannot clear subscription.`
      );
      return null;
    }

    try {
      return await this.prisma.user.update({
        where: { id: user.id },
        data: {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodBegin: null,
          stripeCurrentPeriodEnd: null,
          // Keep stripeCustomerId? Maybe, depends on if you want to retain the link
          // Keep stripeSubscriptionStartDate? Maybe for historical reference
        },
      });
    } catch (error) {
      this.handleError(error);
    }
  }
}

export const userRepository = new UserRepository();
