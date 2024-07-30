import { RoleT } from "@/types";
import { auth, clerkClient } from "@clerk/nextjs";
import CryptoJS, { SHA256 } from "crypto-js";

export function generateHashId(name: string, courseCode: string): string {
  // Combine the name and course code
  const input = name + courseCode;

  // Generate a hash using SHA-256
  const hash = SHA256(input).toString(CryptoJS.enc.Hex);

  const shortHash = hash.substring(0, 8);

  return shortHash;
}

export function generateSlug(name: string, courseCode: string): string {
  // Combine the name and course code;
  const shortHash = generateHashId(name, courseCode);
  return "course" + "-" + shortHash;
}

export function sqlTimestampToString(timestamp: string): Date {
  const dateString = timestamp.substring(0, 23) + "Z";
  const date = new Date(dateString);
  return date;
}

export async function getUid(): Promise<string> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not logged in");
  const {
    privateMetadata: { uid },
  } = await clerkClient.users.getUser(userId);

  return uid as string;
}

export async function getRole(): Promise<RoleT> {
  const { userId } = await auth();
  if (!userId) throw new Error("Not logged in");
  const {
    publicMetadata: { role },
  } = await clerkClient.users.getUser(userId);

  return role as RoleT;
}

export const shuffle = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

function timeout(ms: number) {
  return new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Request timed out")), ms)
  );
}

// Your existing fetch request with a timeout
export async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutDuration: number
): Promise<Response> {
  // Create a promise that rejects after `timeoutDuration` milliseconds
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error("Request timed out")), timeoutDuration);
  });

  // Race the fetch request against the timeout
  const response = await Promise.race([fetch(url, options), timeoutPromise]);

  // Assuming the race was won by the fetch request and it completed successfully,
  // the response is returned here.
  return response;
}
