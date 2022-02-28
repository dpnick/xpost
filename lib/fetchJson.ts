import toast from 'react-hot-toast';

export default function fetchJson<T>(
  url: string,
  init?: RequestInit,
  showToast?: boolean,
  customToasts?: { loading: string; success: string; error: string }
): Promise<T> {
  const promise = fetch(url, init)
    .then((response) => {
      if (!response.ok) {
        console.log(response);
        throw new Error('An error occured');
      }
      return response.json();
    })
    .catch((err) => {
      console.log(err);
      throw new Error('An error occured');
    });

  if (showToast) {
    toast.promise(promise, {
      loading: customToasts?.loading ?? 'Getting ready',
      success: customToasts?.success ?? 'Here we go',
      error: customToasts?.error ?? 'Error occured',
    });
  }

  return promise;
}
