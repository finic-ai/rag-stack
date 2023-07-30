/* Release: ee65b719 (Latest – unreleased) */

module.exports = {
  // ...

  theme: {
    extend: {
      colors: {
        brand: {
          50: "rgb(238, 242, 255)",
          100: "rgb(224, 231, 255)",
          200: "rgb(199, 210, 254)",
          300: "rgb(165, 180, 252)",
          400: "rgb(129, 140, 248)",
          500: "rgb(99, 102, 241)",
          600: "rgb(79, 70, 229)",
          700: "rgb(67, 56, 202)",
          800: "rgb(55, 48, 163)",
          900: "rgb(49, 46, 129)",
        },
        neutral: {
          50: "rgb(250, 250, 250)",
          100: "rgb(245, 245, 245)",
          200: "rgb(229, 229, 229)",
          300: "rgb(212, 212, 212)",
          400: "rgb(163, 163, 163)",
          500: "rgb(115, 115, 115)",
          600: "rgb(82, 82, 82)",
          700: "rgb(64, 64, 64)",
          800: "rgb(38, 38, 38)",
          900: "rgb(23, 23, 23)",
        },
        error: {
          50: "rgb(254, 242, 242)",
          100: "rgb(254, 226, 226)",
          200: "rgb(254, 202, 202)",
          300: "rgb(252, 165, 165)",
          400: "rgb(248, 113, 113)",
          500: "rgb(239, 68, 68)",
          600: "rgb(220, 38, 38)",
          700: "rgb(185, 28, 28)",
          800: "rgb(153, 27, 27)",
          900: "rgb(127, 29, 29)",
        },
        warning: {
          50: "rgb(254, 252, 232)",
          100: "rgb(254, 249, 195)",
          200: "rgb(254, 240, 138)",
          300: "rgb(253, 224, 71)",
          400: "rgb(250, 204, 21)",
          500: "rgb(234, 179, 8)",
          600: "rgb(202, 138, 4)",
          700: "rgb(161, 98, 7)",
          800: "rgb(133, 77, 14)",
          900: "rgb(113, 63, 18)",
        },
        success: {
          50: "rgb(240, 253, 244)",
          100: "rgb(220, 252, 231)",
          200: "rgb(187, 247, 208)",
          300: "rgb(134, 239, 172)",
          400: "rgb(74, 222, 128)",
          500: "rgb(34, 197, 94)",
          600: "rgb(22, 163, 74)",
          700: "rgb(21, 128, 61)",
          800: "rgb(22, 101, 52)",
          900: "rgb(20, 83, 45)",
        },
        "brand-primary": "rgb(79, 70, 229)",
        "default-font": "rgb(23, 23, 23)",
        "subtext-color": "rgb(115, 115, 115)",
        "neutral-border": "rgb(229, 229, 229)",
        white: "rgb(255, 255, 255)",
        "default-background": "rgb(255, 255, 255)",
      },
      fontSize: {
        label: [
          "12px",
          {
            lineHeight: "16px",
            fontWeight: "400",
          },
        ],
        "label-bold": [
          "12px",
          {
            lineHeight: "16px",
            fontWeight: "600",
          },
        ],
        body: [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "body-bold": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "600",
          },
        ],
        subheader: [
          "18px",
          {
            lineHeight: "28px",
            fontWeight: "500",
          },
        ],
        "section-header": [
          "30px",
          {
            lineHeight: "38px",
            fontWeight: "500",
          },
        ],
        header: [
          "36px",
          {
            lineHeight: "40px",
            fontWeight: "500",
          },
        ],
        "monospace-body": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
      },
      fontFamily: {
        label: "Inter",
        "label-bold": "Inter",
        body: "Inter",
        "body-bold": "Inter",
        subheader: "Inter",
        "section-header": "Inter",
        header: "Inter",
        "monospace-body": "monospace",
      },
      container: {
        padding: {
          sm: "calc((100vw + 16px - 640px) / 2)",
          md: "calc((100vw + 16px - 768px) / 2)",
          lg: "calc((100vw + 16px - 1024px) / 2)",
          xl: "calc((100vw + 16px - 1280px) / 2)",
          "2xl": "calc((100vw + 16px - 1536px) / 2)",
        },
      },
      spacing: {
        112: "28rem",
        144: "36rem",
        192: "48rem",
      },
    },
  },
};
