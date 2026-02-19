import { API } from '@/constants/api.constant';
import { TLoginFormData, TRegisterFormData } from '@/features/auth/auth.schema';
import { apiClient, apiClientUntoken } from '@/lib/api.instance';
import { IUser } from '@/shared/types/user.interface';

export interface IAuthResponse {
  access_token: string;
  refresh_token: string;
  user: Omit<IUser, 'password'>;
}

export const login = async (value: TLoginFormData): Promise<IAuthResponse> => {
  const {
    data: { access_token, refresh_token, user },
  } = await apiClientUntoken.post(API.LOGIN, value);
  return { access_token, refresh_token, user };
};

export const register = async (value: TRegisterFormData): Promise<IAuthResponse> => {
  const {
    data: { access_token, refresh_token, user },
  } = await apiClientUntoken.post(API.REGISTER, value);
  return { access_token, refresh_token, user };
};

export const validateEmail = async (email: string) => {
  const { data } = await apiClientUntoken.post(API.VALIDATE_EMAIL, { email });
  return data;
};

export const resetPassword = async (email: string, newPass: string) => {
  const { data } = await apiClientUntoken.post(API.RESET_PASSWORD, { email, newPass });
  return data;
};

export const verifyCurrentPassword = async (oldPass: string) => {
  const { data } = await apiClient.post(API.VERIFY_CURRENT_PASSWORD, { oldPass });
  return data;
};

export const updatePassword = async (newPass: string) => {
  const { data } = await apiClient.post(API.UPDATE_PASSWORD, { newPass });
  return data;
};
