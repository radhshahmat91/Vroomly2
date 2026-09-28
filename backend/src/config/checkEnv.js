/**
 * Fails fast on missing *required* config, and warns (without crashing) on
 * missing *optional* third-party integrations so local development still
 * boots — Cloudinary/Stripe/Maps just degrade to a clear runtime error only
 * when a request actually needs them.
 */
function checkEnv() {
  const required = ['MONGO_URI', 'JWT_SECRET'];
  const missingRequired = required.filter((key) => !process.env[key]);

  if (missingRequired.length) {
    console.error(`✖ Missing required environment variable(s): ${missingRequired.join(', ')}`);
    console.error('  Copy backend/.env.example to backend/.env and fill these in before starting the server.');
    process.exit(1);
  }

  const optional = {
    CLOUDINARY_CLOUD_NAME: 'Image uploads (car photos, avatars) will not work',
    STRIPE_SECRET_KEY: 'Payments will not work',
  };

  Object.entries(optional).forEach(([key, warning]) => {
    if (!process.env[key]) {
      console.warn(`⚠ ${key} is not set — ${warning} until it is configured in backend/.env`);
    }
  });
}

module.exports = checkEnv;
