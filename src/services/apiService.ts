import axios from 'axios';
import TokenService from './tokenService';

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
  private static BASE_URL = 'https://key-beat.herokuapp.com';
  private tokenService: TokenService;

  constructor(tokenService: TokenService) {
    this.tokenService = tokenService;
  }

  public register = (data: RegisterType) => {
    return axios.post(`${ApiService.BASE_URL}/auth/register`, data);
  };

  public login = (data: LoginType) => {
    return axios.post(`${ApiService.BASE_URL}/auth/login`, data);
  };

  public salt = (data: SaltType) => {
    return axios.post(`${ApiService.BASE_URL}/auth/salt`, data);
  };

  public resetPassword = (data: ResetPasswordType) => {
    const token = this.tokenService.getToken();
    return axios.patch(`${ApiService.BASE_URL}/auth/reset/password`, {
      auth: token,
      ...data,
    });
  };

  public reset2FA = (data: Reset2FAType) => {
    return axios.patch(`${ApiService.BASE_URL}/auth/reset/2fa`, data);
  };

  public addCredential = (data: AddCredentialType[]) => {
    const token = this.tokenService.getToken();
    return axios.post(`${ApiService.BASE_URL}/credential`, {
      auth: token,
      items: data,
    });
  };

  public modifyCredential = (data: ModifyCredentialType[]) => {
    const token = this.tokenService.getToken();
    return axios.patch(`${ApiService.BASE_URL}/credential`, {
      auth: token,
      items: data,
    });
  };

  public deleteCredential = (data: DeleteCredentialType[]) => {
    const token = this.tokenService.getToken();
    return axios.delete(`${ApiService.BASE_URL}/credential`, {
      data: {
        auth: token,
        items: data,
      },
    });
  };

  public synchronizeCredential = (data: SynchronizeCredentialType[]) => {
    const token = this.tokenService.getToken();
    return axios.post(`${ApiService.BASE_URL}/credential/sync`, {
      auth: token,
      ...data,
    });
  };
}
