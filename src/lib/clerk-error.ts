type ClerkErrorLike = {
  longMessage?: string;
  message?: string;
} | null | undefined;

export function getClerkErrorMessage(
  error: ClerkErrorLike,
  fallback = "Something went wrong. Please try again."
) {
  return error?.longMessage || error?.message || fallback;
}
