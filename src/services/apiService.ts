import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import TokenService from './tokenService';
import {
  generateKeyPair,
  rsaEncrypt,
  PublicKey,
  pubKeyToPem,
  rsaDecrypt,
  aesEncrypt,
  aesDecrypt,
} from '../functions/crypto';
import { fromBase64, randomBytes, toBase64, extractServerErrors } from '../functions/utils';

interface RegisterType {
  name: string;
  login: string;
  password: string;
  salt: string;
}

interface LoginType {
  login: string;
  password: string;
  token: string;
}

interface SaltType {
  login: string;
  token: string;
}

interface ResetPasswordType {
  password: string;
  newPassword: string;
  salt: string;
}

interface Reset2FAType {
  login: string;
  resetToken: string;
}

interface AddCredentialType {
  id: string;
  data: string;
}

interface ModifyCredentialType {
  id: string;
  data: string;
}

interface DeleteCredentialType {
  id: string;
}

interface SynchronizeCredentialType {
  lastSynchronizedDate: number;
  ids: string[];
}

export default class ApiService {
  private axiosInstance: AxiosInstance;
  private baseUrl: string;
  private tokenService: TokenService;
  private encryptedKeys = generateKeyPair();

  constructor(tokenService: TokenService, baseUrl: string, serverPublic: PublicKey) {
    this.tokenService = tokenService;
    this.baseUrl = baseUrl;
    this.axiosInstance = axios.create();

    this.axiosInstance.interceptors.request.use((config) => {
      if (config.data === undefined) {
        return config;
      }

      const jsonData = JSON.stringify({
        ...config.data,
        key: toBase64(pubKeyToPem(this.encryptedKeys.publicKey)),
      });
      const aesKey = randomBytes(32);
      const data = aesEncrypt(aesKey, jsonData);
      const key = rsaEncrypt(aesKey, serverPublic);
      config.data = {
        key,
        data: toBase64(data),
      };
      return config;
    });

    const onFulfilled = (res: AxiosResponse) => {
      console.log(res);
      if (res.data === '') {
        res.data = {
          data: res.data,
          errors: [],
        };
        return res;
      }

      const aesKey = rsaDecrypt(res.data.key, this.encryptedKeys.privateKey);
      const decryptedData = aesDecrypt(aesKey, fromBase64(res.data.data));
      console.log(decryptedData);
      const data = decryptedData === '' ? {} : JSON.parse(decryptedData);
      res.data = {
        data,
        errors: [],
      };
      return res;
    };

    const onRejected = (error: AxiosError) => {
      const res = error.response;
      console.log(error);
      console.log(res);
      if (res?.status === 406) {
        res.data = {
          data: {},
          errors: extractServerErrors(res.data.message),
        };
        return res;
      }

      if (!res || !res.data.key) {
        return {
          data: {
            data: {},
            errors: ['Request failed'],
          },
        };
      }

      const aesKey = rsaDecrypt(res.data.key, this.encryptedKeys.privateKey);
      const decryptedData = aesDecrypt(aesKey, fromBase64(res.data.data));
      const data = JSON.parse(decryptedData);
      res.data = {
        data: {},
        errors: extractServerErrors(data.message),
      };
      return res;
    };

    this.axiosInstance.interceptors.response.use(onFulfilled, onRejected);
  }

  public register = (data: RegisterType) => {
    return this.axiosInstance.post(`${this.baseUrl}/auth/register`, data);
  };

  public login = (data: LoginType) => {
    return this.axiosInstance.post(`${this.baseUrl}/auth/login`, data);
  };

  public logout = () => {
    return this.axiosInstance.post(`${this.baseUrl}/auth/logout`, {
      auth: this.tokenService.getToken(),
    });
  };

  public salt = (data: SaltType) => {
    return this.axiosInstance.post(`${this.baseUrl}/auth/salt`, data);
  };

  public resetPassword = (data: ResetPasswordType) => {
    return this.axiosInstance.patch(`${this.baseUrl}/auth/reset/password`, {
      auth: this.tokenService.getToken(),
      ...data,
    });
  };

  public reset2FA = (data: Reset2FAType) => {
    return this.axiosInstance.patch(`${this.baseUrl}/auth/reset/2fa`, data);
  };

  public addCredential = (data: AddCredentialType[]) => {
    return this.axiosInstance.post(`${this.baseUrl}/credential`, {
      auth: this.tokenService.getToken(),
      items: data,
    });
  };

  public modifyCredential = (data: ModifyCredentialType[]) => {
    return this.axiosInstance.patch(`${this.baseUrl}/credential`, {
      auth: this.tokenService.getToken(),
      items: data,
    });
  };

  public deleteCredential = (data: DeleteCredentialType[]) => {
    return this.axiosInstance.delete(`${this.baseUrl}/credential`, {
      data: {
        auth: this.tokenService.getToken(),
        items: data,
      },
    });
  };

  public synchronizeCredential = (data: SynchronizeCredentialType) => {
    return this.axiosInstance.post(`${this.baseUrl}/credential/sync`, {
      auth: this.tokenService.getToken(),
      ...data,
    });
  };
}
