import { z } from 'zod';

// プラグイン設定に関する型定義
export const PluginConfigSchema = z.object({
  name: z.string(),
  version: z.string(),
  description: z.string().optional(),
  author: z.string().optional(),
});

export type PluginConfig = z.infer<typeof PluginConfigSchema>;

// Larkテーブルのフィールドに関する型定義
export const FieldTypeSchema = z.enum([
  'text',
  'number',
  'select',
  'multiSelect',
  'date',
  'checkbox',
  'user',
  'phone',
  'email',
  'url',
  'attachment',
  'singleLink',
  'lookup',
  'formula',
  'createdTime',
  'modifiedTime',
  'createdUser',
  'modifiedUser',
]);

export type FieldType = z.infer<typeof FieldTypeSchema>;

export const FieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: FieldTypeSchema,
  property: z.record(z.any()).optional(),
});

export type Field = z.infer<typeof FieldSchema>;

// テーブルビューに関する型定義
export const ViewTypeSchema = z.enum(['grid', 'kanban', 'gallery', 'gantt', 'form']);

export type ViewType = z.infer<typeof ViewTypeSchema>;

export const ViewSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: ViewTypeSchema,
});

export type View = z.infer<typeof ViewSchema>;

// レコードに関する型定義
export const RecordSchema = z.object({
  recordId: z.string(),
  fields: z.record(z.any()),
});

export type Record = z.infer<typeof RecordSchema>;

// プラグインイベントに関する型定義
export const EventTypeSchema = z.enum([
  'onLoad',
  'onRecordSelect',
  'onRecordCreate',
  'onRecordUpdate',
  'onRecordDelete',
  'onViewChange',
  'onConfigChange',
]);

export type EventType = z.infer<typeof EventTypeSchema>;

export const EventSchema = z.object({
  type: EventTypeSchema,
  data: z.any(),
});

export type Event = z.infer<typeof EventSchema>; 