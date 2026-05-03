Here's a comprehensive list of all API endpoints available in the Pear Desktop API Server plugin:

## Authentication Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/{id}` | Request access token for client ID [1](#3-0)  |

## Player Control Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/play` | Start playback [2](#3-1)  |
| POST | `/api/v1/pause` | Pause playback [3](#3-2)  |
| POST | `/api/v1/toggle-play` | Toggle between play and pause [4](#3-3)  |
| POST | `/api/v1/previous` | Play previous song [5](#3-4)  |
| POST | `/api/v1/next` | Play next song [6](#3-5)  |

## Like/Dislike Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/like-state` | Get current like state [7](#3-6)  |
| POST | `/api/v1/like` | Like current song [8](#3-7)  |
| POST | `/api/v1/dislike` | Dislike current song [9](#3-8)  |

## Seeking Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/seek-to` | Seek to specific time in seconds [10](#3-9)  |
| POST | `/api/v1/go-back` | Go back by specified seconds [11](#3-10)  |
| POST | `/api/v1/go-forward` | Go forward by specified seconds [12](#3-11)  |

## Shuffle & Repeat Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/shuffle` | Get shuffle state [13](#3-12)  |
| POST | `/api/v1/shuffle` | Toggle shuffle [14](#3-13)  |
| GET | `/api/v1/repeat-mode` | Get repeat mode (NONE/ALL/ONE) [15](#3-14)  |
| POST | `/api/v1/switch-repeat` | Switch repeat mode [16](#3-15)  |

## Volume Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/volume` | Get current volume state [17](#3-16)  |
| POST | `/api/v1/volume` | Set volume level [18](#3-17)  |
| POST | `/api/v1/toggle-mute` | Toggle mute state [19](#3-18)  |

## Fullscreen Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/fullscreen` | Get fullscreen state [20](#3-19)  |
| POST | `/api/v1/fullscreen` | Set fullscreen state [21](#3-20)  |

## Song Information Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/song-info` | Get current song info (deprecated) [22](#3-21)  |
| GET | `/api/v1/song` | Get current song info [23](#3-22)  |

## Queue Management Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/queue-info` | Get queue info (deprecated) [24](#3-23)  |
| GET | `/api/v1/queue` | Get current queue info [25](#3-24)  |
| POST | `/api/v1/queue` | Add song to queue [26](#3-25)  |
| PATCH | `/api/v1/queue/{index}` | Move song in queue [27](#3-26)  |
| DELETE | `/api/v1/queue/{index}` | Remove song from queue [28](#3-27)  |
| PATCH | `/api/v1/queue` | Set current queue index [29](#3-28)  |
| DELETE | `/api/v1/queue` | Clear entire queue [30](#3-29)  |

## Search Endpoint

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/search` | Search for songs [31](#3-30)  |

## WebSocket Endpoint

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/ws` | WebSocket for real-time updates [32](#3-31)  |

## Documentation Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/doc` | OpenAPI documentation [33](#3-32)  |
| GET | `/swagger` | Swagger UI interface [34](#3-33)  |

## Notes

- All endpoints under `/api/*` require JWT authentication unless the auth strategy is set to `NONE` [35](#3-34) 
- The API version is currently `v1`
- Deprecated endpoints (`song-info`, `queue-info`) are kept for backward compatibility
- The WebSocket endpoint provides real-time updates for player state, volume, shuffle, repeat, and position changes
- Default server runs on port `26538` [36](#3-35)

### Citations

**File:** src/plugins/api-server/backend/routes/auth.ts (L16-42)
```typescript
  request: createRoute({
    method: 'post',
    path: '/auth/{id}',
    summary: '',
    description: '',
    security: [],
    request: {
      params: z.object({
        id: z.string(),
      }),
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({
              accessToken: z.string(),
            }),
          },
        },
      },
      403: {
        description: 'Forbidden',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L36-46)
```typescript
  previous: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/previous`,
    summary: 'play previous song',
    description: 'Plays the previous song in the queue',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L47-57)
```typescript
  next: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/next`,
    summary: 'play next song',
    description: 'Plays the next song in the queue',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L58-68)
```typescript
  play: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/play`,
    summary: 'Play',
    description: 'Change the state of the player to play',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L69-79)
```typescript
  pause: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/pause`,
    summary: 'Pause',
    description: 'Change the state of the player to pause',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L80-91)
```typescript
  togglePlay: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/toggle-play`,
    summary: 'Toggle play/pause',
    description:
      'Change the state of the player to play if paused, or pause if playing',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L92-109)
```typescript
  getLikeState: createRoute({
    method: 'get',
    path: `/api/${API_VERSION}/like-state`,
    summary: 'get like state',
    description: 'Get the current like state',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({
              state: z.enum(LikeType).nullable(),
            }),
          },
        },
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L110-120)
```typescript
  like: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/like`,
    summary: 'like song',
    description: 'Set the current song as liked',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L121-131)
```typescript
  dislike: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/dislike`,
    summary: 'dislike song',
    description: 'Set the current song as disliked',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L132-152)
```typescript
  seekTo: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/seek-to`,
    summary: 'seek',
    description: 'Seek to a specific time in the current song',
    request: {
      body: {
        description: 'seconds to seek to',
        content: {
          'application/json': {
            schema: SeekSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L153-173)
```typescript
  goBack: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/go-back`,
    summary: 'go back',
    description: 'Move the current song back by a number of seconds',
    request: {
      body: {
        description: 'seconds to go back',
        content: {
          'application/json': {
            schema: GoBackSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L175-195)
```typescript
  goForward: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/go-forward`,
    summary: 'go forward',
    description: 'Move the current song forward by a number of seconds',
    request: {
      body: {
        description: 'seconds to go forward',
        content: {
          'application/json': {
            schema: GoForwardScheme,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L196-213)
```typescript
  getShuffleState: createRoute({
    method: 'get',
    path: `/api/${API_VERSION}/shuffle`,
    summary: 'get shuffle state',
    description: 'Get the current shuffle state',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({
              state: z.boolean().nullable(),
            }),
          },
        },
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L214-224)
```typescript
  shuffle: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/shuffle`,
    summary: 'shuffle',
    description: 'Shuffle the queue',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L225-242)
```typescript
  repeatMode: createRoute({
    method: 'get',
    path: `/api/${API_VERSION}/repeat-mode`,
    summary: 'get current repeat mode',
    description: 'Get the current repeat mode (NONE, ALL, ONE)',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({
              mode: z.enum(['ONE', 'NONE', 'ALL']).nullable(),
            }),
          },
        },
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L243-263)
```typescript
  switchRepeat: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/switch-repeat`,
    summary: 'switch repeat',
    description: 'Switch the repeat mode',
    request: {
      body: {
        description: 'number of times to click the repeat button',
        content: {
          'application/json': {
            schema: SwitchRepeatSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L264-284)
```typescript
  setVolume: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/volume`,
    summary: 'set volume',
    description: 'Set the volume of the player',
    request: {
      body: {
        description: 'volume to set',
        content: {
          'application/json': {
            schema: SetVolumeSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L285-303)
```typescript
  getVolumeState: createRoute({
    method: 'get',
    path: `/api/${API_VERSION}/volume`,
    summary: 'get volume state',
    description: 'Get the current volume state of the player',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({
              state: z.number(),
              isMuted: z.boolean(),
            }),
          },
        },
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L304-324)
```typescript
  setFullscreen: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/fullscreen`,
    summary: 'set fullscreen',
    description: 'Set the fullscreen state of the player',
    request: {
      body: {
        description: 'fullscreen state',
        content: {
          'application/json': {
            schema: SetFullscreenSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L325-335)
```typescript
  toggleMute: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/toggle-mute`,
    summary: 'toggle mute',
    description: 'Toggle the mute state of the player',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L337-354)
```typescript
  getFullscreenState: createRoute({
    method: 'get',
    path: `/api/${API_VERSION}/fullscreen`,
    summary: 'get fullscreen state',
    description: 'Get the current fullscreen state',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({
              state: z.boolean(),
            }),
          },
        },
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L355-374)
```typescript
  oldQueueInfo: createRoute({
    deprecated: true,
    method: 'get',
    path: `/api/${API_VERSION}/queue-info`,
    summary: 'get current queue info',
    description: 'Get the current queue info',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({}),
          },
        },
      },
      204: {
        description: 'No queue info',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L375-394)
```typescript
  oldSongInfo: createRoute({
    deprecated: true,
    method: 'get',
    path: `/api/${API_VERSION}/song-info`,
    summary: 'get current song info',
    description: 'Get the current song info',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: SongInfoSchema,
          },
        },
      },
      204: {
        description: 'No song info',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L395-413)
```typescript
  songInfo: createRoute({
    method: 'get',
    path: `/api/${API_VERSION}/song`,
    summary: 'get current song info',
    description: 'Get the current song info',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: SongInfoSchema,
          },
        },
      },
      204: {
        description: 'No song info',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L414-432)
```typescript
  queueInfo: createRoute({
    method: 'get',
    path: `/api/${API_VERSION}/queue`,
    summary: 'get current queue info',
    description: 'Get the current queue info',
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({}),
          },
        },
      },
      204: {
        description: 'No queue info',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L433-453)
```typescript
  addSongToQueue: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/queue`,
    summary: 'add song to queue',
    description: 'Add a song to the queue',
    request: {
      body: {
        description: 'video id of the song to add',
        content: {
          'application/json': {
            schema: AddSongToQueueSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L454-475)
```typescript
  moveSongInQueue: createRoute({
    method: 'patch',
    path: `/api/${API_VERSION}/queue/{index}`,
    summary: 'move song in queue',
    description: 'Move a song in the queue',
    request: {
      params: QueueParamsSchema,
      body: {
        description: 'index to move the song to',
        content: {
          'application/json': {
            schema: MoveSongInQueueSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L476-489)
```typescript
  removeSongFromQueue: createRoute({
    method: 'delete',
    path: `/api/${API_VERSION}/queue/{index}`,
    summary: 'remove song from queue',
    description: 'Remove a song from the queue',
    request: {
      params: QueueParamsSchema,
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L490-510)
```typescript
  setQueueIndex: createRoute({
    method: 'patch',
    path: `/api/${API_VERSION}/queue`,
    summary: 'set queue index',
    description: 'Set the current index of the queue',
    request: {
      body: {
        description: 'index to move the song to',
        content: {
          'application/json': {
            schema: SetQueueIndexSchema,
          },
        },
      },
    },
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L511-521)
```typescript
  clearQueue: createRoute({
    method: 'delete',
    path: `/api/${API_VERSION}/queue`,
    summary: 'clear queue',
    description: 'Clear the queue',
    responses: {
      204: {
        description: 'Success',
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/control.ts (L522-547)
```typescript
  search: createRoute({
    method: 'post',
    path: `/api/${API_VERSION}/search`,
    summary: 'search for a song',
    description: 'search for a song',
    request: {
      body: {
        description: 'search query',
        content: {
          'application/json': {
            schema: SearchSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: 'Success',
        content: {
          'application/json': {
            schema: z.object({}),
          },
        },
      },
    },
  }),
```

**File:** src/plugins/api-server/backend/routes/websocket.ts (L119-130)
```typescript
  app.openapi(
    createRoute({
      method: 'get',
      path: `/api/${API_VERSION}/ws`,
      summary: 'websocket endpoint',
      description: 'WebSocket endpoint for real-time updates',
      responses: {
        101: {
          description: 'Switching Protocols',
        },
      },
    }),
```

**File:** src/plugins/api-server/backend/main.ts (L87-110)
```typescript
    this.app.use('/api/*', async (ctx, next) => {
      const config = await backendCtx.getConfig();

      if (config.authStrategy !== AuthStrategy.NONE) {
        return await jwt({
          secret: config.secret,
        })(ctx, next);
      }
      await next();
    });
    this.app.use('/api/*', async (ctx, next) => {
      const result = await JWTPayloadSchema.spa(await ctx.get('jwtPayload'));
      const config = await backendCtx.getConfig();

      const isAuthorized =
        config.authStrategy === AuthStrategy.NONE ||
        (result.success && config.authorizedClients.includes(result.data.id));
      if (!isAuthorized) {
        ctx.status(401);
        return ctx.body('Unauthorized');
      }

      return await next();
    });
```

**File:** src/plugins/api-server/backend/main.ts (L137-150)
```typescript
    this.app.doc('/doc', {
      openapi: '3.1.0',
      info: {
        version: '1.0.0',
        title: 'Pear Desktop API Server',
        description:
          'Note: You need to get an access token using the `/auth/{id}` endpoint first to call any API endpoints under `/api`.',
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
    });
```

**File:** src/plugins/api-server/backend/main.ts (L152-152)
```typescript
    this.app.get('/swagger', swaggerUI({ url: '/doc' }));
```

