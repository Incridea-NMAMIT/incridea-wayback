export const ASSISTIVE_TOUCH_PREFERENCE_KEY = "assistive-touch-enabled";
export const ASSISTIVE_TOUCH_PREFERENCE_EVENT =
  "assistive-touch-preference-change";

const DEFAULT_ASSISTIVE_TOUCH_ENABLED = true;

export function getAssistiveTouchPreference(): boolean {
  if (typeof window === "undefined") {
    return DEFAULT_ASSISTIVE_TOUCH_ENABLED;
  }

  const value = window.localStorage.getItem(ASSISTIVE_TOUCH_PREFERENCE_KEY);
  if (value === null) {
    return DEFAULT_ASSISTIVE_TOUCH_ENABLED;
  }

  return value === "true";
}

export function setAssistiveTouchPreference(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    ASSISTIVE_TOUCH_PREFERENCE_KEY,
    String(enabled),
  );
  window.dispatchEvent(
    new CustomEvent(ASSISTIVE_TOUCH_PREFERENCE_EVENT, {
      detail: { enabled },
    }),
  );
}
