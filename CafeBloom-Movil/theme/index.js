import COLORS from "../theme/colors";
import FONTS from "../theme/fonts";
import SPACING from "../theme/spacing";

const theme = {
  colors: COLORS,
  fonts: FONTS,
  spacing: SPACING,

  radius: {
    sm: 10,
    md: 16,
    lg: 24,
    pill: 50,
  },

  shadow: {
    soft: {
      shadowColor: "#000",
      shadowOpacity: 0.05,
      shadowRadius: 10,
      elevation: 2,
    },
  },
};

export default theme;