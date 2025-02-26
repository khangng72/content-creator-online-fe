export const generateApi = (apiUrl: string) => {
  return process.env.NEXT_PUBLIC_API_DOMAIN + apiUrl;
};

export const API_AUTH_LOGIN = "/auth/login";
