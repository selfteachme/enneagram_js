// tailwind.config.js
module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: [],
  theme: {
    extend: {
      backgroundImage: {
        background: "url(/img/bg.jpg)",
      },
      colors: {
        primary: "#E9C376",
        secondary: "#C6DCD9",
      },
      gridRow: {
        layout: "repeat(3, 1fr)",
      },
      inset: {
        "-1": "-.25rem",
        "-4": "-1rem",
        "-7": "-1.75rem",
        "-8": "-2rem",
        "-10": "-2.5rem",
        "-16": "-4rem",
        "-32": "-8rem",
        2: ".5rem",
        4: "1rem",
        32: "8rem",
        "1/2": "50%",
        "-1/2": "-50%",
      },
      minHeight: {
        40: "10rem",
      },
      flex: {
        2: "2 2 0%",
      },
    },
    fill: (theme) => ({
      current: "currentColor",
      gray: theme("colors.gray.500"),
      primary: theme("colors.primary"),
      black: theme("colors.black"),
      white: theme("colors.white"),
    }),
    fontFamily: {
      display: ["Tropiline"],
      sans: ["Nunito Sans"],
      handwriting: ["Rising Moon"],
      serif: ["Roboto Slab"],
    },
    fontSize: {
      xs: ".75rem",
      sm: ".875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.5rem",
      "7xl": "4rem",
      "8xl": "5rem",
      "9xl": "6rem",
    },
  },
  variants: {
    outline: ["responsive", "focus", "hover", "active"],
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    function ({ addComponents }) {
      addComponents({
        ".container": {
          width: "90%",
          marginLeft: "auto",
          marginRight: "auto",
          "@screen sm": {
            maxWidth: "640px",
          },
          "@screen md": {
            maxWidth: "768px",
          },
          "@screen lg": {
            maxWidth: "1024px",
          },
          "@screen xl": {
            maxWidth: "1280px",
          },
        },
      });
    },
  ],
};
