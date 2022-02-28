function fetchSwr<T>(url: string, init?: RequestInit): Promise<T> {
  return fetch(url, init)
    .then((res) => {
      if (!res.ok) {
        throw new Error('An error occured');
      }
      return res.json();
    })
    .catch(() => {
      throw new Error('An error occured');
    });
}

export default fetchSwr;
