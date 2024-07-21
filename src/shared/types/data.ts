export type PaginatedData<T> = {
  page: number;
  count: number;
  total: number;
  data: T[];
};
export type Response<T> = {
  success: boolean;
  message: string;
  data: T;
};

export type ResponseWithNoData = Response<never>;

export type ResponseWithOptionalData<T> = Response<T> | ResponseWithNoData;

export type ValidationError = {
  statusCode: number;
  message: string[];
  error: string;
};

export const data = <X>(value: Response<X> | ResponseWithNoData): X | null =>
  (value as Response<X>)?.data;
