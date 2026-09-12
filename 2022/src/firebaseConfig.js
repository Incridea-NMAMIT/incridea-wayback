// Wayback archives are read-only. Do not initialise or contact the retired
// Firebase project from this historical frontend.
export const app = null;
export const auth = null;
export const key = "";

export async function getUserInfo() {
    return null;
}

export async function loginUser() {
    throw new Error("Sign-in is unavailable in the Incridea 2022 Wayback archive.");
}
