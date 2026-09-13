export const generateEventUrl = (eventName: string, eventID: string) => {
  return `/event/${eventName.toLowerCase().replaceAll(" ", "-")}-${eventID}`;
};

// Historical media is bundled in public/ so the archive does not rely on the
// retired Cloudinary account.
export const baseImageUrl = "";
