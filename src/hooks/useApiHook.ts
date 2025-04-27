import { useCallback } from 'react';
import { AxiosResponse, CanceledError } from 'axios';
import { useSnackbar } from 'notistack';

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

type HandleRequestType<Data> = (
  request: () => Promise<AxiosResponse<ResponseApi<Data>>>,
) => Promise<Data | void>;

type UseApiHookReturnType<Data> = {
  handleRequest: HandleRequestType<Data>;
};

interface MessageArg {
  resolveMessage?: string;
  rejectMessage?: string;
}

export function useApiHook<Data>(
  messages: MessageArg = {
    resolveMessage: undefined,
    rejectMessage: undefined,
  },
): UseApiHookReturnType<Data> {
  const { enqueueSnackbar } = useSnackbar();

  const { rejectMessage, resolveMessage } = messages;

  const handleRequest = useCallback(
    async (
      request: () => Promise<AxiosResponse<ResponseApi<Data>>>,
    ): Promise<Data | void> => {
      try {
        const resp = await request();

        if (resp.data.status) {
          // Show success message
          if (resolveMessage) {
            enqueueSnackbar(resolveMessage, { variant: 'success' });
          }

          return resp.data.data;
        } else {
          // Show reject message
          if (rejectMessage) {
            enqueueSnackbar(rejectMessage, {
              variant: 'error',
            });
          } else {
            enqueueSnackbar(resp.data.errors.join(', '), {
              variant: 'error',
            });
          }
        }
      } catch (e) {
        // Ignore cancel error
        if (e instanceof CanceledError) {
          return;
        } else {
          return Promise.reject(e);
        }
      }
    },
    [enqueueSnackbar, rejectMessage, resolveMessage],
  );
  return { handleRequest };
}
