import { Action, ActionPanel, Detail, Icon, List, showToast, Toast, useNavigation } from "@vicinae/api";
import { useEffect, useState } from "react";
import { client, Song } from "./api";

export default function SearchPearDesktop() {
  const { push } = useNavigation();
  const [searchText, setSearchText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [songs, setSongs] = useState<Song[]>([]);
  const [rawResponse, setRawResponse] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    async function init() {
      const success = await client.authenticate();
      setIsAuthenticated(success);
      setIsLoading(false);
      if (!success) {
        showToast(Toast.Style.Failure, "Authentication Failed", "Make sure Pear Desktop is running with API Server enabled.");
      }
    }
    init();
  }, []);

  useEffect(() => {
    async function search() {
      if (!isAuthenticated || searchText.length < 2) {
        setSongs([]);
        setRawResponse(null);
        return;
      }
      setIsLoading(true);
      const response = await client.search(searchText);
      setSongs(response.results);
      setRawResponse(response.raw);
      setIsLoading(false);
    }
    search();
  }, [searchText, isAuthenticated]);

  const handlePlay = async (song?: Song) => {
    const success = song ? await client.playSong(song.videoId) : await client.resume();
    if (success) {
      showToast(Toast.Style.Success, song ? `Added ${song.title} to queue` : "Playback Resumed");
    } else {
      showToast(Toast.Style.Failure, "Failed to play");
    }
  };

  const handlePause = async () => {
    const success = await client.pause();
    if (success) {
      showToast(Toast.Style.Success, "Playback Paused");
    }
  };

  const handleNext = async () => {
    const success = await client.next();
    if (success) {
      showToast(Toast.Style.Success, "Skipped to next track");
    }
  };

  const handlePrevious = async () => {
    const success = await client.previous();
    if (success) {
      showToast(Toast.Style.Success, "Back to previous track");
    }
  };

  const handleAddToQueue = async (song: Song) => {
    const success = await client.addToQueue(song.videoId);
    if (success) {
      showToast(Toast.Style.Success, `Added ${song.title} to queue`);
    } else {
      showToast(Toast.Style.Failure, "Failed to add to queue");
    }
  };

  const showRawResponse = () => {
    push(
      <Detail
        markdown={`### Raw API Response\n\`\`\`json\n${JSON.stringify(rawResponse, null, 2)}\n\`\`\``}
        actions={
          <ActionPanel>
            <Action.CopyToClipboard title="Copy JSON" content={JSON.stringify(rawResponse, null, 2)} />
          </ActionPanel>
        }
      />
    );
  };

  return (
    <List
      isLoading={isLoading}
      onSearchTextChange={setSearchText}
      searchBarPlaceholder="Search music on Pear Desktop..."
      throttle
    >
      <List.Section title="Results">
        {songs.map((song) => (
          <List.Item
            key={song.videoId}
            title={song.title}
            subtitle={song.artist}
            icon={song.thumbnail || Icon.Music}
            actions={
              <ActionPanel>
                <Action
                  title="Play Now"
                  icon={Icon.Play}
                  onAction={() => handlePlay(song)}
                />
                <Action
                  title="Add to Queue"
                  icon={Icon.Plus}
                  onAction={() => handleAddToQueue(song)}
                  shortcut={{ modifiers: ["cmd"], key: "a" }}
                />
                <ActionPanel.Section title="Debug">
                  <Action
                    title="Show Raw Response"
                    icon={Icon.Bug}
                    onAction={showRawResponse}
                    shortcut={{ modifiers: ["cmd", "shift"], key: "d" }}
                  />
                </ActionPanel.Section>
                <ActionPanel.Section title="Controls">
                  <Action
                    title="Pause"
                    icon={Icon.Pause}
                    onAction={handlePause}
                    shortcut={{ modifiers: ["cmd"], key: "p" }}
                  />
                  <Action
                    title="Next Track"
                    icon={Icon.Forward}
                    onAction={handleNext}
                    shortcut={{ modifiers: ["cmd"], key: "n" }}
                  />
                  <Action
                    title="Previous Track"
                    icon={Icon.Backward}
                    onAction={handlePrevious}
                    shortcut={{ modifiers: ["cmd"], key: "b" }}
                  />
                </ActionPanel.Section>
              </ActionPanel>
            }
          />
        ))}
      </List.Section>

      {rawResponse && (
        <List.Section title="Debug Information">
          <List.Item
            title="View Raw API Response"
            icon={Icon.Bug}
            subtitle="Click to see the JSON returned by the server"
            actions={
              <ActionPanel>
                <Action title="Show Raw Response" icon={Icon.Bug} onAction={showRawResponse} />
              </ActionPanel>
            }
          />
        </List.Section>
      )}

      {!songs.length && !isLoading && searchText.length >= 2 && (
        <List.EmptyView 
          title="No results found" 
          description={`No songs matching "${searchText}"`} 
          actions={
            <ActionPanel>
               <Action title="Show Raw Response" icon={Icon.Bug} onAction={showRawResponse} />
            </ActionPanel>
          }
        />
      )}
      {!searchText && (
        <List.EmptyView 
          title="Search Pear Desktop" 
          description="Type to search for songs, artists, or albums" 
          icon={Icon.MagnifyingGlass}
        />
      )}
    </List>
  );
}
