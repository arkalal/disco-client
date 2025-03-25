const localURL = "http://localhost:3000";
const stagingURL = "https://disco-pi.vercel.app";
const prodURL = "";

export const getBaseURL = () => {
  // Use stagingURL for production until prodURL is set
  return process.env.NODE_ENV === "production"
    ? prodURL || stagingURL
    : localURL;
};
