import axios, {
  AxiosError,
  AxiosInstance,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { API_URL, REFRESH_TOKEN_URL } from '~/config/constants';
import { logout, updateTokens } from '~/modules/user/actions';
import { store } from '~/store';
import { RefreshTokensResponse } from '~/types/responses';
import { changeDataKeysCase } from '~/utils/cases';
import { appendToFormData, serializeParams } from '~/utils/helpers';

let isRefreshing = false;
let failedQueue: any = [];

const processQueue = (error: AxiosError | null, token: string): void => {
  failedQueue.forEach((prom: any) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const setTokenInterceptors = (instance: AxiosInstance): void => {
  instance.interceptors.request.use(
    (config: AxiosRequestConfig) => {
      const token = store.getState().user.auth?.access;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    error => {
      return Promise.reject(error);
    },
  );
  instance.interceptors.response.use(
    response => response,
    error => {
      const originalRequest = error.config;

      if (
        error.response.status === 401 &&
        !originalRequest._retry &&
        originalRequest.url !== REFRESH_TOKEN_URL &&
        store.getState().user.auth?.refresh
      ) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch(err => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        return new Promise((resolve, reject) => {
          instance
            .post(REFRESH_TOKEN_URL, { refresh: store.getState().user.auth?.refresh })
            .then(({ data }: AxiosResponse<RefreshTokensResponse>) => {
              store.dispatch(updateTokens(data));
              instance.defaults.headers.common.Authorization = `Bearer ${data.data.access}`;
              originalRequest.headers.Authorization = `Bearer ${data.data.access}`;

              processQueue(null, data.data.access);
              resolve(instance(originalRequest));
            })
            .catch(err => {
              processQueue(err, '');
              store.dispatch(logout());
              reject(err);
            })
            .then(() => {
              isRefreshing = false;
            });
        });
      }

      return Promise.reject(error);
    },
  );
};

export class Api {
  static instance: Api;

  axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create({
      timeout: 30000,
      baseURL: API_URL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      paramsSerializer(params) {
        const caseChangedParams: Record<string, unknown> = changeDataKeysCase(params, 'snakeCase');

        return serializeParams(caseChangedParams);
      },
      transformRequest(requestData, headers) {
        if (headers['Content-Type'] === 'multipart/form-data') {
          if (requestData instanceof FormData) {
            return requestData;
          }

          const formData = new FormData();

          appendToFormData(formData, requestData);

          return formData;
        }

        return JSON.stringify(changeDataKeysCase(requestData, 'snakeCase'));
      },
      transformResponse(responseJSON: string | null) {
        if (responseJSON === null || responseJSON === '') {
          return undefined;
        }

        const responseData = JSON.parse(responseJSON);

        return changeDataKeysCase(responseData, 'camelCase');
      },
    });
    setTokenInterceptors(this.axiosInstance);
  }

  static getInstance(): Api {
    if (!Api.instance) {
      Api.instance = new Api();
    }
    return Api.instance;
  }

  static getAxios(): AxiosInstance {
    return Api.getInstance().axiosInstance;
  }

  static get<T = any>(
    url: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {},
  ): AxiosPromise<T> {
    return Api.getAxios().get(url, { params, ...config });
  }

  static delete<T = any>(
    url: string,
    params: Record<string, any> = {},
    config: AxiosRequestConfig = {},
  ): AxiosPromise<T> {
    return Api.getAxios().delete(url, { params, ...config });
  }

  static post<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return Api.getAxios().post(url, data, config);
  }

  static put<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return Api.getAxios().put(url, data, config);
  }

  static patch<T = any>(
    url: string,
    data?: Record<string, any>,
    config?: AxiosRequestConfig,
  ): AxiosPromise<T> {
    return Api.getAxios().patch(url, data, config);
  }
}
