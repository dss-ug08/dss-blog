import adapter from "@sveltejs/adapter-auto";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  kit: {
    adapter: adapter(),
    csrf: {
      // TODO: DANGER! remove this in production or CSRF attacks will be possible!
      checkOrigin: false,
    },
    alias: {
      $cmp: "./src/components/",
    },
  },
};

export default config;
