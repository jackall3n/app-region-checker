import type { AppStoreLookupResponse } from "./types";

export async function lookupApp(
  appId: string,
  country: string
): Promise<AppStoreLookupResponse | null> {
  const time = Date.now();

  try {
    const response = await fetch(
      `https://itunes.apple.com/lookup?id=${appId}&country=${country}&rand=${time}`
    );

    const data: AppStoreLookupResponse = await response.json();

    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}