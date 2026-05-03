import { showToast, Toast } from "@vicinae/api";
import { client } from "./api";

export default async function Command() {
  const authenticated = await client.authenticate();
  if (!authenticated) {
    await showToast(Toast.Style.Failure, "Authentication Failed", "Make sure Pear Desktop is running.");
    return;
  }

  const songInfo = await client.getSongInfo();
  
  if (songInfo && songInfo.isPaused === false) {
    // Song is already playing, user wants to play "next song in queue"
    const success = await client.next();
    if (success) {
      await showToast(Toast.Style.Success, "Skipped to next track");
    } else {
      await showToast(Toast.Style.Failure, "Failed to skip");
    }
  } else {
    // No song playing or paused, current behavior (toggle to play) is fine
    const success = await client.togglePlay();
    if (success) {
      await showToast(Toast.Style.Success, songInfo ? "Resumed Playback" : "Started Playback");
    } else {
      await showToast(Toast.Style.Failure, "Failed to start playback");
    }
  }
}
