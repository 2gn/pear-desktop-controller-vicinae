import { Action, ActionPanel, Icon, List, showToast, Toast } from "@vicinae/api";
import { useEffect, useState } from "react";
import { client, Song } from "./api";

export default function ViewQueue() {
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);

  const fetchQueue = async () => {
    setIsLoading(true);
    const authenticated = await client.authenticate();
    if (authenticated) {
      const queue = await client.getQueue();
      setSongs(queue);
    } else {
      showToast(Toast.Style.Failure, "Authentication Failed");
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchQueue();
  }, []);

  const handlePlayFromQueue = async (index: number) => {
    const success = await client.setQueueIndex(index);
    if (success) {
      await client.resume();
      showToast(Toast.Style.Success, "Playing selected song");
      fetchQueue();
    } else {
      showToast(Toast.Style.Failure, "Failed to play song");
    }
  };

  const handleRemoveFromQueue = async (index: number) => {
    const success = await client.removeFromQueue(index);
    if (success) {
      showToast(Toast.Style.Success, "Removed from queue");
      fetchQueue();
    } else {
      showToast(Toast.Style.Failure, "Failed to remove");
    }
  };

  const handleClearQueue = async () => {
    const success = await client.clearQueue();
    if (success) {
      showToast(Toast.Style.Success, "Queue cleared");
      setSongs([]);
    } else {
      showToast(Toast.Style.Failure, "Failed to clear queue");
    }
  };

  return (
    <List isLoading={isLoading} searchBarPlaceholder="Filter queue...">
      <List.Section title="Current Queue" subtitle={`${songs.length} songs`}>
        {songs.map((song, index) => (
          <List.Item
            key={`${song.videoId}-${index}`}
            title={song.title}
            subtitle={song.artist}
            icon={song.thumbnail || Icon.Music}
            actions={
              <ActionPanel>
                <Action
                  title="Play This"
                  icon={Icon.Play}
                  onAction={() => handlePlayFromQueue(index)}
                />
                <Action
                  title="Remove from Queue"
                  icon={Icon.Trash}
                  onAction={() => handleRemoveFromQueue(index)}
                  shortcut={{ modifiers: ["cmd"], key: "delete" }}
                />
                <ActionPanel.Section title="Queue Controls">
                  <Action
                    title="Refresh"
                    icon={Icon.ArrowClockwise}
                    onAction={fetchQueue}
                    shortcut={{ modifiers: ["cmd"], key: "r" }}
                  />
                  <Action
                    title="Clear Entire Queue"
                    icon={Icon.XMarkCircle}
                    onAction={handleClearQueue}
                    style={Action.Style.Destructive}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "delete" }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
      {!songs.length && !isLoading && (
        <List.EmptyView 
          title="Queue is empty" 
          icon={Icon.List} 
          actions={
            <ActionPanel>
              <Action title="Refresh" icon={Icon.ArrowClockwise} onAction={fetchQueue} />
            </ActionPanel>
          }
        />
      )}
    </List>
  );
}
