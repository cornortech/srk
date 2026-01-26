export interface TaskUser {
  universityId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
}

export type CaptureStatus =
  | 'idle'
  | 'capturing'
  | 'uploading'
  | 'success'
  | 'error';

