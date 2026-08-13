/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { ChefHat, Sparkles, Flame } from "lucide-react";

function Greetings() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white px-5 pb-6 pt-7">
      {/* Decorative background shapes */}
      <motion.div
        className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-cyan-200/30 blur-2xl"
        animate={{
          x: [0, 8, 0],
          y: [0, 8, 0],
          scale: [1, 1.05, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="pointer-events-none absolute -left-16 top-24 h-32 w-32 rounded-full bg-blue-200/20 blur-2xl"
        animate={{
          x: [0, -6, 0],
          y: [0, 6, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="relative">
        {/* Small welcome label */}
        <motion.div
          className="mb-3 flex items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <motion.div
            className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-100"
            animate={{
              rotate: [0, 8, -8, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Sparkles size={14} className="text-cyan-600" />
          </motion.div>

          <span className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-600">
            Welcome back
          </span>
        </motion.div>

        {/* Greeting */}
        <motion.div
          className="flex items-start justify-between gap-4"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.1,
            ease: "easeOut",
          }}
        >
          <div className="min-w-0">
            <h2 className="text-[29px] font-extrabold leading-[1.1] tracking-tight text-slate-800">
              Good morning,
              <br />
              <span className="bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">
                User! 👋
              </span>
            </h2>

            <motion.p
              className="mt-3 max-w-[250px] text-[14px] font-medium leading-5 text-slate-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              Ready to sharpen your cooking skills and create something
              delicious?
            </motion.p>
          </div>

          {/* Chef Icon */}
          <motion.div
            className="relative flex-shrink-0"
            initial={{ opacity: 0, scale: 0.7, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              type: "spring",
              stiffness: 180,
              damping: 12,
            }}
          >
            <motion.div
              className="flex h-[72px] w-[72px] items-center justify-center rounded-[22px] bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-200"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <ChefHat size={38} strokeWidth={1.8} className="text-white" />
            </motion.div>

            {/* Floating flame */}
            <motion.div
              className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-orange-100 shadow-sm"
              animate={{
                y: [0, -4, 0],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Flame size={14} className="fill-orange-400 text-orange-500" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Today's motivation card */}
        <motion.div
          className="mt-6 overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 p-[1px] shadow-md shadow-blue-100"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            delay: 0.4,
            ease: "easeOut",
          }}
        >
          <motion.div
            className="relative overflow-hidden rounded-[15px] bg-white px-4 py-4"
            whileTap={{ scale: 0.98 }}
          >
            <motion.div
              className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-cyan-50"
              animate={{
                scale: [1, 1.12, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            <div className="relative flex items-center gap-3">
              <motion.div
                className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-sky-50"
                animate={{
                  rotate: [0, -4, 4, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <span className="text-lg">🍳</span>
              </motion.div>

              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-cyan-600">
                  Today's goal
                </p>

                <p className="mt-0.5 text-[13px] font-semibold leading-5 text-slate-700">
                  Learn one new technique today.
                </p>
              </div>

              <motion.div
                className="ml-auto text-xl"
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 8, -8, 0],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ✨
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

export default Greetings;
