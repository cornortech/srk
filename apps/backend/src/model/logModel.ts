import { Schema, model, Document } from 'mongoose';

export interface ILog extends Document {
  timestamp: Date;
  level: 'info' | 'warn' | 'error' | 'debug';
  app: 'task' | 'grow' | 'university' | 'backend';
  module?: string; // e.g., 'auth', 'user', 'finance'
  message: string;
  metadata?: Record<string, any>;
  stackTrace?: string;
  userId?: string; // optional user context
  requestId?: string; // for tracing requests
  url?: string; // endpoint that generated the log
  method?: string; // HTTP method
  statusCode?: number; // HTTP status code
  duration?: number; // request duration in ms
  createdAt: Date;
  updatedAt: Date;
}

const logSchema = new Schema<ILog>(
  {
    timestamp: {
      type: Date,
      default: () => new Date(),
      index: true,
    },
    level: {
      type: String,
      enum: ['info', 'warn', 'error', 'debug'],
      default: 'info',
      index: true,
    },
    app: {
      type: String,
      enum: ['task', 'grow', 'university', 'backend'],
      default: 'backend',
      index: true,
    },
    module: {
      type: String,
      index: true,
    },
    message: {
      type: String,
      required: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    stackTrace: String,
    userId: {
      type: String,
      index: true,
    },
    requestId: {
      type: String,
      index: true,
    },
    url: String,
    method: String,
    statusCode: Number,
    duration: Number,
  },
  {
    timestamps: true,
    collection: 'logs',
  }
);

// Compound index for efficient querying
logSchema.index({ app: 1, timestamp: -1 });
logSchema.index({ level: 1, timestamp: -1 });
logSchema.index({ app: 1, level: 1, timestamp: -1 });

export const LogModel = model<ILog>('Log', logSchema);
