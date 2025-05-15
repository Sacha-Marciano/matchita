import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

export default function DuplicateCheckAnimation() {

  return (
    <div className="relative flex justify-center items-center h-24 w-full">
      <motion.div
        className="absolute"
        animate={{ x: [-100, 0], opacity: [0.8, 1] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: ["linear"],
        }}
      >
        <CheckCircle className="text-matchita-600 w-8 h-8" />
      </motion.div>

      <motion.div
        className="absolute"
        animate={{ x: [100, 0], opacity: [0.8, 1] }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "reverse",
          ease: ["linear"],
        }}
      >
        <CheckCircle className="text-matchita-600 w-8 h-8" />
      </motion.div>
    </div>
  );
}
