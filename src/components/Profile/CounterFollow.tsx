import { motion, AnimatePresence } from "framer-motion";

const AnimatedCounter = ({ value }: { value: number }) => {
  return (
    <span className="inline-flex overflow-hidden h-[1.5em] relative font-bold">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
};

export default AnimatedCounter;
