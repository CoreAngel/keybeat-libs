import axios from 'axios';
import TokenService from './tokenService';
import { generateKeyPair, rsaEncrypt, PublicKey, pubKeyToPem, rsaDecrypt } from "../functions/crypto";

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
  id: number;
  iv: string;
  data: string;
}

interface ModifyCredentialType {
  id: string;
  iv: string;
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
  // private static BASE_URL = 'https://key-beat.herokuapp.com';
  private baseUrl: string;
  private tokenService: TokenService;
  private encryptedKeys = generateKeyPair();

  constructor(tokenService: TokenService, baseUrl: string, serverPublic: PublicKey) {
    this.tokenService = tokenService;
    this.baseUrl = baseUrl;

    axios.interceptors.request.use((config) => {
      if (config.data === undefined) {
        return config;
      }

      const jsonData = JSON.stringify({
        ...config.data,
        pubKey: pubKeyToPem(this.encryptedKeys.publicKey)
      })
      config.data = rsaEncrypt(jsonData, serverPublic);
      return config;
    })

    axios.interceptors.response.use((response) => {
      if (response.data === '') {
        return response;
      }

      const decryptedData = rsaDecrypt(response.data, this.encryptedKeys.privateKey);
      response.data = JSON.parse(decryptedData)
      return response;
    })
  }

  public register = (data: RegisterType) => {
    return axios.post(`${this.baseUrl}/auth/register`, data);
  };

  public login = (data: LoginType) => {
    return axios.post(`${this.baseUrl}/auth/login`, data);
  };

  public salt = (data: SaltType) => {
    return axios.post(`${this.baseUrl}/auth/salt`, data);
  };

  public resetPassword = (data: ResetPasswordType) => {
    return axios.patch(`${this.baseUrl}/auth/reset/password`, {
      auth: this.tokenService.getToken(),
      ...data,
    });
  };

  public reset2FA = (data: Reset2FAType) => {
    return axios.patch(`${this.baseUrl}/auth/reset/2fa`, data);
  };

  public addCredential = (data: AddCredentialType[]) => {
    return axios.post(`${this.baseUrl}/credential`, {
      auth: this.tokenService.getToken(),
      items: data,
    });
  };

  public modifyCredential = (data: ModifyCredentialType[]) => {
    return axios.patch(`${this.baseUrl}/credential`, {
      auth: this.tokenService.getToken(),
      items: data,
    });
  };

  public deleteCredential = (data: DeleteCredentialType[]) => {
    return axios.delete(`${this.baseUrl}/credential`, {
      data: {
        auth: this.tokenService.getToken(),
        items: data,
      },
    });
  };

  public synchronizeCredential = (data: SynchronizeCredentialType[]) => {
    return axios.post(`${this.baseUrl}/credential/sync`, {
      auth: this.tokenService.getToken(),
      ...data,
    });
  };
}
