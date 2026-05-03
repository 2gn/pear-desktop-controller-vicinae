import { showToast, Toast } from "@vicinae/api";
import { client } from "./api";

export default async function Command() {
  const authenticated = await client.authenticate();
  if (!authenticated) {
    await showToast(Toast.Style.Failure, "Authentication Failed");
    return;
  }

  const success = await client.next();
  if (success) {
    await showToast(Toast.Style.Success, "Skipped to next track");
  } else {
    await showToast(Toast.Style.Failure, "Failed to skip track");
  }
}
