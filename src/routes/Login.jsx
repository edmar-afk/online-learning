/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "framer-motion";
import { Phone, Lock, ArrowRight } from "lucide-react";
import logo from "../assets/images/logo.png";
import loginAnimation from "../utils/loginAnimations";

function Login() {
  return (
    <div className="h-full bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 flex items-center justify-center">
      <motion.div
        variants={loginAnimation.container}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        <motion.div
          variants={loginAnimation.fadeUp}
          className="bg-white bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-100 shadow-2xl p-8 border border-blue-100"
        >
          <motion.div
            variants={loginAnimation.logo}
            className="flex justify-center"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center shadow-xl shadow-blue-200">
              <img src={logo} className="w-12 h-12 rounded-full" alt="" />
            </div>
          </motion.div>

          <motion.div
            variants={loginAnimation.fadeUp}
            className="text-center mt-6"
          >
            <h1 className="text-3xl font-bold text-slate-900">Welcome to Learning App</h1>

            <p className="text-slate-500 mt-2 leading-relaxed">
              Continue learning delicious recipes and improve your cooking
              skills.
            </p>
          </motion.div>

          <motion.form
            variants={loginAnimation.container}
            className="mt-8 space-y-5"
          >
            <motion.div variants={loginAnimation.fadeUp}>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Mobile Number
              </label>

              <motion.div
                whileFocus="whileFocus"
                variants={loginAnimation.input}
                className="flex items-center bg-blue-50 border border-blue-100 rounded-2xl px-4 h-14 focus-within:border-blue-500 transition"
              >
                <Phone size={20} className="text-blue-600" />

                <input
                  type="number"
                  placeholder="Enter your mobile number"
                  className="w-full bg-transparent outline-none ml-3 text-slate-700 placeholder:text-slate-400"
                />
              </motion.div>
            </motion.div>

            <motion.div variants={loginAnimation.fadeUp}>
              <label className="text-sm font-medium text-slate-700 mb-2 block">
                Password
              </label>

              <motion.div
                whileFocus="whileFocus"
                variants={loginAnimation.input}
                className="flex items-center bg-blue-50 border border-blue-100 rounded-2xl px-4 h-14 focus-within:border-blue-500 transition"
              >
                <Lock size={20} className="text-blue-600" />

                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full bg-transparent outline-none ml-3 text-slate-700 placeholder:text-slate-400"
                />
              </motion.div>
            </motion.div>

           

            <motion.button
              variants={loginAnimation.button}
              whileHover="whileHover"
              whileTap="whileTap"
              className="w-full h-14 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 text-white font-semibold text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-300"
            >
              Log In
              <ArrowRight size={20} />
            </motion.button>
          </motion.form>

          <motion.div
            variants={loginAnimation.fadeUp}
            className="my-7 flex items-center"
          >
            <div className="flex-1 h-px bg-slate-200"></div>
          </motion.div>

          <motion.div
            variants={loginAnimation.fadeUp}
            className="text-center mt-8"
          >
            <span className="text-slate-500">Don't have an account?</span>

            <button className="ml-2 font-semibold text-blue-600 hover:text-blue-700">
              Sign Up
            </button>
          </motion.div>

          <motion.div
            variants={loginAnimation.fadeUp}
            className="text-center mt-6 text-sm text-slate-500"
          >
            Learn • Cook • Master Recipes 👨‍🍳
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default Login;
