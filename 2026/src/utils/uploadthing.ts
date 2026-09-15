import { generateUploadButton, generateReactHelpers } from "@uploadthing/react"

export type ClientUploadRouter = {
  accommodationIdProof: {
    input: any
    output: { fileUrl: string }
  }
  pdfUploader: {
    input: any
    output: { fileUrl: string }
  }
}

const rawBaseUrl =
  typeof import.meta.env.VITE_API_URL === "string" &&
    import.meta.env.VITE_API_URL.length > 0
    ? import.meta.env.VITE_API_URL
    : "/api";

const apiBaseUrl = rawBaseUrl.replace(/\/+$/, "").endsWith("/api")
  ? rawBaseUrl.replace(/\/+$/, "")
  : `${rawBaseUrl.replace(/\/+$/, "")}/api`;

export const UploadButton = generateUploadButton<any>({
  url: `${apiBaseUrl}/uploadthing`,
});

export const { useUploadThing } = generateReactHelpers<any>({
  url: `${apiBaseUrl}/uploadthing`,
});
