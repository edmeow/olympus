import { AxiosResponse } from 'axios';

export type ResponseData<Data> = {
  data: Data;
  status: true;
  errors: null;
};

export type ResponseError = {
  data: null;
  status: false;
  errors: string[];
};

export type ResponseApi<Data> = ResponseData<Data> | ResponseError;

export interface ResponsePaginated<Data> {
  list: Data[];
  count: number;
}

export type ResponsePaginatedApi<Data> = ResponseApi<ResponsePaginated<Data>>;

export interface ResponseAdd {
  id: string;
}

export interface ResponseStatus {
  status: boolean;
}

export type ResponseApiService<T> = Promise<AxiosResponse<ResponseApi<T>>>;

export type ResponsePaginatedApiService<T> = Promise<
  AxiosResponse<ResponsePaginatedApi<T>>
>;
