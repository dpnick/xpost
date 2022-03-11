import { CustomHttpError } from '@models/http';
import toast from 'react-hot-toast';

export default function fetchJson<T>(
  url: string,
  init?: RequestInit,
  showToast?: boolean,
  customToasts?: { loading: string; success: string | ((res: T) => string) }
): Promise<T> {
  const promise: Promise<T> = fetch(url, init)
    .then(async (response) => {
      const data = await response.json();
      if (!response.ok) {
        const error = (data && data.message) || 'An error occured';
        return Promise.reject(error);
      }
      return data;
    })
    .catch((error) => {
      const message = String(error);
      throw new Error(message ?? 'An error occured');
    });

  if (showToast) {
    toast.promise(promise, {
      loading: customToasts?.loading ?? 'Getting ready',
      success: customToasts?.success ?? 'Here we go',
      error: (err: CustomHttpError) => err.message,
    });
  }

  return promise;
}
