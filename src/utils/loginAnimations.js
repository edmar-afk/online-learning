const loginAnimation = {
  container: {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.12,
      },
    },
  },

  fadeUp: {
    hidden: {
      opacity: 0,
      y: 30,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  },

  logo: {
    hidden: {
      opacity: 0,
      scale: 0.6,
      rotate: -15,
    },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        duration: 0.7,
        type: "spring",
        stiffness: 180,
      },
    },
  },

  button: {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
    whileHover: {
      scale: 1.03,
    },
    whileTap: {
      scale: 0.97,
    },
  },

  input: {
    whileFocus: {
      scale: 1.02,
    },
  },
};

export default loginAnimation;