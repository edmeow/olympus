import { AxiosResponse } from 'axios';

export type ResponseData<Data> = {
  data: Data;
  status: true;
  errors: null;
};

export type ResponseDataList<Data> = {
  data: Data[];
};

export type ResponseApiList<Data> = ResponseDataList<Data> | ResponseError;

export type ResponseApiListService<T> = Promise<AxiosResponse<ResponseApi<T>>>;

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

export type ResponseBlobService = Promise<AxiosResponse<Blob>>;
