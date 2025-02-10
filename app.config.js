export default ({ config }) => ({
  ...config,
  extra: {
    FIREBASE_BASE_URL: process.env.FIREBASE_BASE_URL,
    API_KEY_FIREBASE: process.env.API_KEY_FIREBASE
  }
}); 