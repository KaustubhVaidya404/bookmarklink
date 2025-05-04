import { auth } from "@/lib/firebase";

function logout() {
  auth.signOut();
}
