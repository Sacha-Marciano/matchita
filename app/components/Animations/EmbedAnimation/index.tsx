import { motion } from "framer-motion";

export default function VectorizationAnimation() {
  return (
    <div className="flex items-center justify-center h-24">
      <motion.div
        className="w-4 h-4 bg-matchita-600 rounded-full mx-1"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", delay: 0 }}
      />
      <motion.div
        className="w-4 h-4 bg-matchita-600  rounded-full mx-1"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", delay: 0.2 }}
      />
      <motion.div
        className="w-4 h-4 bg-matchita-600  rounded-full mx-1"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, repeatType: "loop", delay: 0.4 }}
      />
    </div>
  );
}
