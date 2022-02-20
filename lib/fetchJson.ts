import toast from 'react-hot-toast';

export default async function fetchJson<T>(
  url: string,
  init?: RequestInit | undefined,
  showToast?: boolean,
  customToasts?: { loading: string; success: string; error: string }
): Promise<T> {
  const promise = fetch(url, init);
  if (showToast) {
    toast.promise(promise, {
      loading: customToasts?.loading ?? 'Getting ready',
      success: customToasts?.success ?? 'Here we go',
      error: customToasts?.error ?? 'Error occured',
    });
  }

  const response = await promise;
  if (!response.ok) {
    console.log(response);
    throw new Error('An error occured');
  }
  const result = await response.json();
  return result;
}
