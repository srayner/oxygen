import type { EventTypeConfig } from '@srayner02/svix-admin'

export const eventTypes: EventTypeConfig[] = [
  {
    name: 'weight.log.added',
    label: 'Weight Log Added',
    description: 'Fired when a user logs a weight entry',
    schema: {
      '1': {
        type: 'object',
        examples: [
          {
            type: 'weight.log.added',
            data: {
              id: 'clx1234abc',
              userId: 'user_abc123',
              date: '2026-06-28T00:00:00.000Z',
              weightKg: 75.5,
              createdAt: '2026-06-28T09:00:00.000Z',
              updatedAt: '2026-06-28T09:00:00.000Z',
            },
          },
        ],
        properties: {
          type: { type: 'string', example: 'weight.log.added' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clx1234abc' },
              userId: { type: 'string', example: 'user_abc123' },
              date: { type: 'string', example: '2026-06-28T00:00:00.000Z' },
              weightKg: { type: 'number', example: 75.5 },
              createdAt: {
                type: 'string',
                example: '2026-06-28T09:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                example: '2026-06-28T09:00:00.000Z',
              },
            },
            required: ['id', 'userId', 'date', 'weightKg'],
          },
        },
        required: ['type', 'data'],
      },
    },
  },
  {
    name: 'weight.log.deleted',
    label: 'Weight Log Deleted',
    description: 'Fired when a user deletes a weight entry',
    schema: {
      '1': {
        type: 'object',
        examples: [
          {
            type: 'weight.log.deleted',
            data: {
              id: 'clx1234abc',
              userId: 'user_abc123',
              date: '2026-06-28T00:00:00.000Z',
              weightKg: 75.5,
            },
          },
        ],
        properties: {
          type: { type: 'string', example: 'weight.log.deleted' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clx1234abc' },
              userId: { type: 'string', example: 'user_abc123' },
              date: { type: 'string', example: '2026-06-28T00:00:00.000Z' },
              weightKg: { type: 'number', example: 75.5 },
            },
            required: ['id', 'userId', 'date', 'weightKg'],
          },
        },
        required: ['type', 'data'],
      },
    },
  },
  {
    name: 'mood.log.added',
    label: 'Mood Log Added',
    description: 'Fired when a user logs a mood entry',
    schema: {
      '1': {
        type: 'object',
        examples: [
          {
            type: 'mood.log.added',
            data: {
              id: 'clx1234abc',
              userId: 'user_abc123',
              date: '2026-06-28T00:00:00.000Z',
              moodLevel: 4,
              energyLevel: 3,
              notes: 'Feeling good today',
              createdAt: '2026-06-28T12:00:00.000Z',
              updatedAt: '2026-06-28T12:00:00.000Z',
            },
          },
        ],
        properties: {
          type: { type: 'string', example: 'mood.log.added' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clx1234abc' },
              userId: { type: 'string', example: 'user_abc123' },
              date: { type: 'string', example: '2026-06-28T00:00:00.000Z' },
              moodLevel: { type: 'number', example: 4 },
              energyLevel: { type: 'number', example: 3 },
              notes: { type: 'string', example: 'Feeling good today' },
              createdAt: {
                type: 'string',
                example: '2026-06-28T12:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                example: '2026-06-28T12:00:00.000Z',
              },
            },
            required: ['id', 'userId', 'date', 'moodLevel', 'energyLevel'],
          },
        },
        required: ['type', 'data'],
      },
    },
  },
  {
    name: 'mood.log.deleted',
    label: 'Mood Log Deleted',
    description: 'Fired when a user deletes a mood entry',
    schema: {
      '1': {
        type: 'object',
        examples: [
          {
            type: 'mood.log.deleted',
            data: {
              id: 'clx1234abc',
              userId: 'user_abc123',
              date: '2026-06-28T00:00:00.000Z',
            },
          },
        ],
        properties: {
          type: { type: 'string', example: 'mood.log.deleted' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clx1234abc' },
              userId: { type: 'string', example: 'user_abc123' },
              date: { type: 'string', example: '2026-06-28T00:00:00.000Z' },
            },
            required: ['id', 'userId', 'date'],
          },
        },
        required: ['type', 'data'],
      },
    },
  },
  {
    name: 'sleep.log.added',
    label: 'Sleep Log Added',
    description: 'Fired when a user logs a sleep session',
    schema: {
      '1': {
        type: 'object',
        examples: [
          {
            type: 'sleep.log.added',
            data: {
              id: 'clx1234abc',
              userId: 'user_abc123',
              date: '2026-06-28T00:00:00.000Z',
              bedtime: '22:00',
              waketime: '07:00',
              durationMins: 540,
              createdAt: '2026-06-28T07:00:00.000Z',
              updatedAt: '2026-06-28T07:00:00.000Z',
            },
          },
        ],
        properties: {
          type: { type: 'string', example: 'sleep.log.added' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clx1234abc' },
              userId: { type: 'string', example: 'user_abc123' },
              date: { type: 'string', example: '2026-06-28T00:00:00.000Z' },
              bedtime: { type: 'string', example: '22:00' },
              waketime: { type: 'string', example: '07:00' },
              durationMins: { type: 'number', example: 540 },
              createdAt: {
                type: 'string',
                example: '2026-06-28T07:00:00.000Z',
              },
              updatedAt: {
                type: 'string',
                example: '2026-06-28T07:00:00.000Z',
              },
            },
            required: [
              'id',
              'userId',
              'date',
              'bedtime',
              'waketime',
              'durationMins',
            ],
          },
        },
        required: ['type', 'data'],
      },
    },
  },
  {
    name: 'sleep.log.deleted',
    label: 'Sleep Log Deleted',
    description: 'Fired when a user deletes a sleep entry',
    schema: {
      '1': {
        type: 'object',
        examples: [
          {
            type: 'sleep.log.deleted',
            data: {
              id: 'clx1234abc',
              userId: 'user_abc123',
              date: '2026-06-28T00:00:00.000Z',
            },
          },
        ],
        properties: {
          type: { type: 'string', example: 'sleep.log.deleted' },
          data: {
            type: 'object',
            properties: {
              id: { type: 'string', example: 'clx1234abc' },
              userId: { type: 'string', example: 'user_abc123' },
              date: { type: 'string', example: '2026-06-28T00:00:00.000Z' },
            },
            required: ['id', 'userId', 'date'],
          },
        },
        required: ['type', 'data'],
      },
    },
  },
]
