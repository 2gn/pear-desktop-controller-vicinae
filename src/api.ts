
export interface Song {
  videoId: string;
  title: string;
  artist: string;
  thumbnail?: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface SearchResponse {
  results: Song[];
  raw: any;
}

export class PearDesktopClient {
  public baseUrl: string;
  private accessToken: string | null = null;

  constructor(host = 'localhost', port = 26538) {
    this.baseUrl = `http://${host}:${port}`;
  }

  public getHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.accessToken ? { Authorization: `Bearer ${this.accessToken}` } : {}),
    };
  }

  async authenticate(clientId = 'vicinae-controller'): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/auth/${clientId}`, {
        method: 'POST',
      });
      if (response.ok) {
        const data = (await response.json()) as AuthResponse;
        this.accessToken = data.accessToken;
        return true;
      }
    } catch (error) {
      console.error('Authentication error:', error);
    }
    return false;
  }

  async search(query: string): Promise<SearchResponse> {
    if (!query) return { results: [], raw: null };
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/search`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ query }),
      });
      
      const raw = await response.json();
      const results: Song[] = this.parseSearchResponse(raw);

      return { results, raw };
    } catch (error) {
      console.error('Search error:', error);
      return { results: [], raw: { error: error instanceof Error ? error.message : String(error) } };
    }
  }

  private parseSearchResponse(raw: any): Song[] {
    try {
      const sections = raw?.contents?.tabbedSearchResultsRenderer?.tabs?.[0]?.tabRenderer?.content?.sectionListRenderer?.contents;
      if (!sections || !Array.isArray(sections)) return [];

      const songs: Song[] = [];

      for (const section of sections) {
        const shelf = section.musicShelfRenderer || section.musicCardShelfRenderer;
        if (!shelf || !shelf.contents) continue;

        for (const item of shelf.contents) {
          const renderer = item.musicResponsiveListItemRenderer;
          if (!renderer) continue;

          const title = this.getText(renderer.flexColumns?.[0]);
          const artist = this.getText(renderer.flexColumns?.[1]);
          
          let videoId = renderer.navigationEndpoint?.watchEndpoint?.videoId ||
                        renderer.overlay?.musicItemThumbnailOverlayRenderer?.content?.musicPlayButtonRenderer?.playNavigationEndpoint?.watchEndpoint?.videoId;

          if (!videoId) continue;

          const thumbnail = renderer.thumbnail?.musicThumbnailRenderer?.thumbnail?.thumbnails?.at(-1)?.url;

          songs.push({
            videoId,
            title: title || "Unknown Title",
            artist: artist || "Unknown Artist",
            thumbnail
          });
        }
      }

      return songs;
    } catch (e) {
      console.error("Parsing error", e);
      return [];
    }
  }

  private getText(column: any): string {
    const runs = column?.musicResponsiveListItemFlexColumnRenderer?.text?.runs;
    if (!runs || !Array.isArray(runs)) return "";
    return runs.map((r: any) => r.text).join("");
  }

  async playSong(videoId: string): Promise<boolean> {
    try {
      // 1. Add song to queue
      const addResponse = await fetch(`${this.baseUrl}/api/v1/queue`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ videoId }),
      });

      if (addResponse.ok || addResponse.status === 204) {
        // 2. Get current queue to find the index of the newly added song
        const songs = await this.getQueue();
        const index = songs.findLastIndex(s => s.videoId === videoId);

        if (index !== -1) {
          // 3. Set index and play (Using the same logic as the queue command)
          await this.setQueueIndex(index);
          await this.resume();
          return true;
        }
      }
    } catch (error) {
      console.error('Play song error:', error);
    }
    return false;
  }

  async addToQueue(videoId: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/queue`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ videoId }),
      });
      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error('Add to queue error:', error);
      return false;
    }
  }

  async setQueueIndex(index: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/queue`, {
        method: 'PATCH',
        headers: this.getHeaders(),
        body: JSON.stringify({ index }),
      });
      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error('Set queue index error:', error);
      return false;
    }
  }

  async getSongInfo(): Promise<any | null> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/song`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.error('Get song info error:', error);
    }
    return null;
  }

  async getQueue(): Promise<Song[]> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/queue`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (response.ok) {
        const raw = await response.json();
        return this.parseQueueResponse(raw);
      }
    } catch (error) {
      console.error('Get queue error:', error);
    }
    return [];
  }

  private parseQueueResponse(raw: any): Song[] {
    try {
      const items = raw?.items;
      if (!items || !Array.isArray(items)) return [];

      return items.map((item: any) => {
        const renderer = item.playlistPanelVideoRenderer;
        if (!renderer) return null;

        const title = renderer.title?.runs?.[0]?.text || "Unknown Title";
        const artist = renderer.shortBylineText?.runs?.[0]?.text || "Unknown Artist";
        const videoId = renderer.videoId;
        const thumbnail = renderer.thumbnail?.thumbnails?.at(-1)?.url;

        return { videoId, title, artist, thumbnail };
      }).filter((s: any): s is Song => s !== null);
    } catch (e) {
      console.error("Queue parsing error", e);
      return [];
    }
  }

  async removeFromQueue(index: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/queue/${index}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error('Remove from queue error:', error);
      return false;
    }
  }

  async clearQueue(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/queue`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });
      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error('Clear queue error:', error);
      return false;
    }
  }

  async togglePlay(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/toggle-play`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error('Toggle play error:', error);
    }
    return false;
  }

  async resume(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/play`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error('Resume error:', error);
    }
    return false;
  }

  async pause(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/pause`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error('Pause error:', error);
    }
    return false;
  }

  async next(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/next`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error('Next error:', error);
    }
    return false;
  }

  async previous(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/v1/previous`, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      return response.status === 204 || response.status === 200;
    } catch (error) {
      console.error('Previous error:', error);
    }
    return false;
  }
}

export const client = new PearDesktopClient();
