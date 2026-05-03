import { showToast, Toast } from "@vicinae/api";
import { client } from "./api";

export default async function Command() {
  const authenticated = await client.authenticate();
  if (!authenticated) {
    await showToast(Toast.Style.Failure, "Authentication Failed");
    return;
  }

  const success = await client.previous();
  if (success) {
    await showToast(Toast.Style.Success, "Back to previous track");
  } else {
    await showToast(Toast.Style.Failure, "Failed to go back");
  }
}
