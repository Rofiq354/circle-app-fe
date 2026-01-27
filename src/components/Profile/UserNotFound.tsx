import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { UserX, ArrowLeft } from "lucide-react"; // Import dari Lucide

const UserNotFound = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center justify-center py-28 px-6 text-center"
    >
      {/* Icon Section dengan efek radial gradient */}
      <div className="relative mb-8">
        {/* Lingkaran cahaya di belakang icon */}
        <div className="absolute inset-0 bg-green-500/10 blur-[50px] rounded-full" />

        <div className="relative flex items-center justify-center w-24 h-24 bg-[#1a1a1a] rounded-3xl border border-[#333] shadow-2xl">
          <UserX size={48} className="text-gray-400" strokeWidth={1.5} />
        </div>
      </div>

      {/* Text Section */}
      <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
        Pengguna tidak ditemukan
      </h2>
      <p className="text-gray-400 max-w-70 mb-10 leading-relaxed">
        Maaf, akun dengan username{" "}
        <span className="text-green-500 font-medium">
          @{/* bisa ambil dari params */}
        </span>{" "}
        tidak terdaftar atau telah dihapus.
      </p>

      {/* Action Button dengan hover animation */}
      <motion.button
        whileHover={{ x: -5 }} // Sedikit geser ke kiri saat hover
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate(-1)}
        className="group flex cursor-pointer items-center gap-3 bg-[#262626] text-white px-8 py-3 rounded-full font-semibold border border-[#333] hover:bg-white hover:text-black transition-all duration-300"
      >
        <ArrowLeft size={20} className="group-hover:text-black" />
        <span>Kembali ke Sebelumnya</span>
      </motion.button>
    </motion.div>
  );
};

export default UserNotFound;
