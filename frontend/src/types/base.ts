export interface ResponseEntity<T> {
  success: boolean;
  status: number;
  message: string;
  errorCode: string | null;
  data: T | null;
}

export interface PageResult<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalCount: number;
}
