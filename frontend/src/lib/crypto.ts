/**
 * Deterministic canonical JSON serializer (sorts keys recursively)
 */
export function canonicalizeJSON(obj: unknown): string {
  if (obj === null || typeof obj !== "object") {
    return JSON.stringify(obj);
  }
  if (Array.isArray(obj)) {
    return `[${obj.map((item) => canonicalizeJSON(item)).join(",")}]`;
  }
  const record = obj as Record<string, unknown>;
  const sortedKeys = Object.keys(record).sort();
  const pairs = sortedKeys.map(
    (key) => `${JSON.stringify(key)}:${canonicalizeJSON(record[key])}`
  );
  return `{${pairs.join(",")}}`;
}

/**
 * Computes deterministic SHA-256 hex digest using standard Web Crypto API
 */
export async function computeSHA256(text: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hexString = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hexString;
}

/**
 * Verifies if a given hash matches the SHA-256 digest of the raw canonical payload
 */
export async function verifyCredentialIntegrity(
  hash: string,
  rawPayload: string
): Promise<{ isValid: boolean; calculatedHash: string }> {
  try {
    const calculated = await computeSHA256(rawPayload);
    return {
      isValid: calculated.toLowerCase() === hash.toLowerCase(),
      calculatedHash: calculated,
    };
  } catch {
    return {
      isValid: false,
      calculatedHash: "",
    };
  }
}
