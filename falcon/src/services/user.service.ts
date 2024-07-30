import db from "@/db";
import { RoleT, User } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs";

const userService = {
  async getUid(): Promise<string> {
    const { userId } = await auth();
    if (!userId) throw new Error("Not logged in");
    const {
      privateMetadata: { uid },
    } = await clerkClient.users.getUser(userId);

    return uid as string;
  },

  async getRole(): Promise<RoleT> {
    const { userId } = await auth();
    if (!userId) throw new Error("Not logged in");
    const {
      publicMetadata: { role },
    } = await clerkClient.users.getUser(userId);

    return role as RoleT;
  },

  async get(uid: string): Promise<User> {
    const user = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.id, uid),
    });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
};

export default userService;
