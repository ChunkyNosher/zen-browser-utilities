export default {
  input: 'src/index.js',
  output: {
    file: 'zen-browser-utilities.uc.js',
    format: 'iife',
    banner: `/**
 * Zen Browser Utilities Mod
 * Version: 0.1.0
 * License: MIT
 *
 * Bundled with Rollup from the src/ directory.
 */`,
  },
  onwarn(warning, warn) {
    if (warning.code === 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT') {
      return;
    }

    warn(warning);
  },
};
