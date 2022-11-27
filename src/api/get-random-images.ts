import { BASE_API_URL } from '../constant';
import { getEnvVariable } from '../utils/get-env-variable';

export type ApiResponseType = {
  message: string;
  status: string;
};

const apiBaseUrl: string =
  getEnvVariable({ name: 'API_BASE_URL' }) ?? BASE_API_URL;

export const getRandomImages = async ({
  controller,
}: {
  controller: AbortController;
}) => {
  const endpoint = `${apiBaseUrl}/breeds/image/random`;

  const response: Response = await fetch(endpoint, {
    method: 'GET',
    signal: controller.signal,
  });

  if (!response.ok) {
    const errorMessage: string = await response.text();
    return Promise.reject(errorMessage);
  }

  const data: ApiResponseType = await response.json();
  return data;
};
