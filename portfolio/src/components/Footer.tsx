import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

/**
 * Footer 组件 - 页脚
 * 包含版权信息和返回顶部按钮
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-white/10">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* 版权信息 */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-2 text-gray-500 text-sm"
          >
            <span>© {currentYear} Hedy Ren. 用</span>
            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            <span>和代码构建</span>
          </motion.div>

          {/* 返回顶部按钮 */}
          <motion.button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors"
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>返回顶部</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
