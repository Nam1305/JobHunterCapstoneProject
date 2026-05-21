export interface ResponseEntity<T> {
  success: boolean;
  status: number;
  message: string;
  errorCode: string | null;
  data: T | null;
}
