export interface VerificationFormData {
  documentFile: File | null;
  selfieImage: string | null;
  signature: string | null;
  fullName: string;
  dob: string;
}

export interface StepProps {
  formData: VerificationFormData;
  onNext: () => void;
  onPrev: () => void;
}

export interface DocumentStepProps extends Omit<StepProps, 'onPrev'> {
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface SelfieStepProps extends StepProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isCameraActive: boolean;
  cameraError: string | null;
  onStartCamera: () => void;
  onTakePicture: () => void;
  onRetake: () => void;
}

export interface SignatureStepProps extends StepProps {
  onSignatureSave: (signature: string) => void;
}

export interface DetailsStepProps extends StepProps {
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface ReviewStepProps extends StepProps {
  isSubmitting: boolean;
  submissionStatus: 'success' | 'error' | null;
  onSubmit: () => void;
  onRetry: () => void;
}
