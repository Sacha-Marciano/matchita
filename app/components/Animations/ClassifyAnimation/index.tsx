import { motion } from "framer-motion";

export default function ClassificationAnimation() {
  const itemVariants = {
    initial: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      x: [i === 0 ? -60 : i === 2 ? 60 : 0],
    }),
    animate: (i: number) => ({
      y: [0, -20, 0, 10],
      x: [i === 0 ? -60 : i === 2 ? 60 : 0, 0],
      scale: [1, 1.2, 1],
      opacity: [1, 1, 1, 0],
      transition: {
        delay: i * 0.8,
        duration: 1.4,
        repeat: Infinity,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    }),
  };

  const itemColors = [
    "bg-matchita-300",
    "bg-matchita-700",
    "bg-matchita-900"
  ];

  return (
    <div className="relative w-40 h-40 flex items-center justify-center">
      {/* Central classification box */}
      <div className="w-16 h-16 bg-matchita-500 rounded-md shadow-inner z-0" />

      {/* Animated items */}
      {itemColors.map((color, i) => (
        <motion.div
          key={i}
          className={`w-6 h-6 rounded-full absolute z-10 ${color}`}
          custom={i}
          variants={itemVariants}
          initial="initial"
          animate="animate"
        />
      ))}
    </div>
  );
}
