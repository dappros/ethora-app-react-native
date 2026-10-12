import { useWindowDimensions } from 'react-native';

// Shortest side from which the window is treated as a tablet: iPad, Android tablets,
// unfolded foldables (iPhone Fold, Galaxy Fold). iPad Split View / Slide Over with a
// narrow column stays below it and gets the phone layout.
export const TABLET_MIN_SIDE = 600;

// Auth forms never get wider than this, so fields and buttons do not stretch across a tablet
export const AUTH_CONTENT_MAX_WIDTH = 480;

/**
 * Window-based sizes that follow rotation, Split View / Stage Manager resizes and
 * fold / unfold. Use instead of react-native-responsive-screen's hp / wp, which read
 * Dimensions once at import and never update.
 */
export function useResponsive() {
  const { width, height } = useWindowDimensions();
  const isTablet = Math.min(width, height) >= TABLET_MIN_SIDE;

  return {
    width,
    height,
    isTablet,
    isLandscape: width > height,
    /** Percent of the window height */
    hp: (percent: number) => (height * percent) / 100,
    /** Percent of the window width */
    wp: (percent: number) => (width * percent) / 100,
    /** Auth screen column: 74% of the width as on phones, capped on large screens */
    authContentWidth: Math.min(width * 0.74, AUTH_CONTENT_MAX_WIDTH),
  };
}
