function fetchSwr<T>(url: string, init?: RequestInit): Promise<T> {
  return fetch(url, init).then((res) => res.json());
}

export default fetchSwr;
