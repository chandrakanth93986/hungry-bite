'use client'

import Image from "next/image";
import React from 'react'
import { motion } from "framer-motion";
import { AuroraBackground } from "../components/ui/aurora-background";

export default function Home() {
  return (
    <div>
      <AuroraBackground>
        <motion.div
          initial={{ opacity: 0.0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative flex flex-col gap-4 items-center justify-center px-4"
        >
          <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
            "Helping hungry people - fills your belly!"
            <br />
            "Let's fill our belly with good food without wastage!"
          </div>
          <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
            This website helps you to fill your belly with low cost food.
          </div>
        </motion.div>
      </AuroraBackground>
    </div>
  );
}