export const saveToLocalStorage = <T>(key: string, data: T) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(data));
  }
};

export const getFromLocalStorage = <T>(key: string): T | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(key);
  return data ? (JSON.parse(data) as T) : null;
};
