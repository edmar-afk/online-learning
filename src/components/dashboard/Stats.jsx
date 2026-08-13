/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Trophy, CalendarDays, Flame } from "lucide-react";

function Stats() {
  const stats = [
    {
      label: "Quizzes Taken",
      value: "12",
      icon: Trophy,
      iconBg: "bg-cyan-50",
      iconColor: "text-cyan-600",
      message: "Keep testing yourself!",
    },
    {
      label: "Days Logged In",
      value: "24",
      icon: CalendarDays,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
      message: "You're building a habit!",
    },
  ];

  return (
    <section className="bg-white px-5 py-5">
      {/* Header */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
              rotate: [0, -5, 5, 0],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Flame size={16} className="fill-cyan-400 text-cyan-500" />
          </motion.div>

          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-cyan-600">
            Your Activity
          </p>
        </div>

        <motion.h3
          className="mt-1 text-xl font-extrabold tracking-tight text-slate-800"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.5,
            delay: 0.1,
          }}
        >
          Keep up the good work!
        </motion.h3>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.label}
              className="relative overflow-hidden rounded-2xl border border-sky-100 bg-gradient-to-br from-white to-sky-50/70 p-4 shadow-sm"
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              transition={{
                duration: 0.5,
                delay: 0.15 + index * 0.12,
                ease: "easeOut",
              }}
              whileTap={{
                scale: 0.97,
              }}
            >
              {/* Decorative circle */}
              <motion.div
                className="absolute -right-7 -top-7 h-20 w-20 rounded-full bg-cyan-100/40"
                animate={{
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              />

              {/* Icon */}
              <motion.div
                className={`relative mb-4 flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}
                initial={{ scale: 0.7, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + index * 0.12,
                  type: "spring",
                  stiffness: 200,
                  damping: 12,
                }}
              >
                <motion.div
                  animate={{
                    y: [0, -2, 0],
                  }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: index * 0.3,
                  }}
                >
                  <Icon
                    size={20}
                    strokeWidth={2.2}
                    className={stat.iconColor}
                  />
                </motion.div>
              </motion.div>

              {/* Number */}
              <motion.p
                className="relative text-3xl font-extrabold tracking-tight text-slate-800"
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + index * 0.12,
                  type: "spring",
                  stiffness: 180,
                }}
              >
                {stat.value}
              </motion.p>

              {/* Label */}
              <motion.p
                className="relative mt-1 text-xs font-bold text-slate-600"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.5 + index * 0.12,
                }}
              >
                {stat.label}
              </motion.p>

              {/* Message */}
              <motion.p
                className="relative mt-2 text-[10px] font-medium leading-4 text-slate-400"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.6 + index * 0.12,
                }}
              >
                {stat.message}
              </motion.p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

export default Stats;
