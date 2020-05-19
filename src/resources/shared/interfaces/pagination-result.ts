export interface PaginationResult<T> {
  data: T[];
  total: number;
  limit: number;
  skip: number;
}
