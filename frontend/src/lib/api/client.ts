/**
 * Core HTTP Client for SkillSetu Backend API
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Fetch with deterministic timeout (default 7000ms)
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = 7000
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => {
    try {
      controller.abort(
        new DOMException(`Request timed out after ${timeoutMs}ms`, "TimeoutError")
      );
    } catch {
      controller.abort();
    }
  }, timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}
