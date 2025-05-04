import { auth } from "@/lib/firebase";

export default function logout() {
  auth.signOut();
}
