import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

export default async function handleLogout() {
  try {
        await signOut(auth);
      } catch (error) {
        console.error("Error signing out:", error);
      }
}
