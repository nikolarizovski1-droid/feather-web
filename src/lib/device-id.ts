const STORAGE_KEY = 'feather_device_id';

export function getDeviceId(): string {
  const storedId = localStorage.getItem(STORAGE_KEY);
  if (storedId) return storedId;

  const newId = crypto.randomUUID();
  localStorage.setItem(STORAGE_KEY, newId);
  return newId;
}

export function clearDeviceId(): void {
  localStorage.removeItem(STORAGE_KEY);
}
