export const SITE_NAME = 'WaCraft-Sample';
export const SITE_TAGLINE = 'Professional Construction & Renovation Services';
export const CONTACT_EMAIL = 'kontakt@wacraft.pl';
export const CONTACT_PHONE = '+48 123 456 789';
export const CONTACT_ADDRESS = 'Samplowa 1, 12-345 Samplowo';
export const CONTACT_MAP_EMBED_URL =
  'https://www.openstreetmap.org/export/embed.html?bbox=-0.09&minlat=51.5&maxlat=51.51&minlon=-0.09&maxlon=-0.08&layer=mapnik';

export const DEMO_ADMIN_EMAIL = 'admin@admin.pl';
export const DEMO_ADMIN_PASSWORD = 'Admin123';
export const DEMO_SESSION_KEY = 'wacraft-demo-session';

export const PROJECT_DELETE_CONFIRM_PHRASE = 'NieUsune';

export const createDemoUser = () => ({
  id: 'demo-admin',
  email: DEMO_ADMIN_EMAIL,
  app_metadata: {},
  user_metadata: { demo: true },
});
