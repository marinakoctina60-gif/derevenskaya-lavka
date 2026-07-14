import { cookies } from "next/headers";
import {
  SESSION_COOKIE,
  verifySessionToken,
} from "@/lib/auth-session";

export {
  SESSION_COOKIE,
  createSessionToken,
  verifySessionToken,
  safeEqualString,
  getAdminUsername,
  getAdminPassword,
  sessionCookieOptions,
} from "@/lib/auth-session";

export async function isAuthenticated() {
  const jar = await cookies();
  return verifySessionToken(jar.get(SESSION_COOKIE)?.value);
}
