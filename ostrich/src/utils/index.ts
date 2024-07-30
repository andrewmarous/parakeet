import CryptoJS, { SHA256 } from "crypto-js";

function generateCourseHash(name: string, courseCode: string): string[] {
  // Combine the name and course code
  const input = name + courseCode;

  // Generate a hash using SHA-256
  const hash = SHA256(input).toString(CryptoJS.enc.Hex);

  const hash1 = hash.substring(0, 8);
  const hash2 = hash.substring(9, 17);
  const hash3 = hash.substring(18, 26);

  return [hash1, hash2, hash3];
}

function generateSlug(name: string, courseCode: string): string {
  // Combine the name and course code;
  const shortHash = generateCourseHash(name, courseCode)[2];
  return "course" + "-" + shortHash;
}

export { generateCourseHash, generateSlug };
