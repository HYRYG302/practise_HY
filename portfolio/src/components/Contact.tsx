import { motion } from 'framer-motion';
import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

/**
 * Contact 组件 - 联系方式区域
 * 包含邮箱、GitHub、社交媒体链接
 */
export default function Contact() {
  const contactLinks = [
    {
      name: 'Email',
      value: 'your.email@example.com',
      href: 'mailto:your.email@example.com',
      icon: Mail,
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'GitHub',
      value: 'github.com/yourusername',
      href: 'https://github.com/yourusername',
      icon: Github,
      color: 'from-gray-500 to-gray-700'
    },
    {
      name: 'LinkedIn',
      value: 'linkedin.com/in/yourusername',
      href: 'https://linkedin.com/in/yourusername',
      icon: Linkedin,
      color: 'from-blue-500 to-blue-700'
    },
    {
      name: 'Twitter',
      value: '@yourusername',
      href: 'https://twitter.com/yourusername',
      icon: Twitter,
      color: 'from-sky-400 to-sky-600'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <section
      id="contact"
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-4xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            联系<span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">我</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            如果您有任何问题或合作意向，欢迎通过以下方式与我联系
          </p>
          <div className="w-20 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] mx-auto rounded-full mt-4" />
        </motion.div>

        {/* 联系方式卡片 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid sm:grid-cols-2 gap-6"
        >
          {contactLinks.map((link) => {
            const Icon = link.icon;
            return (
              <motion.a
                key={link.name}
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                variants={itemVariants}
                className="group flex items-center gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:border-white/20 transition-all duration-300"
                whileHover={{ scale: 1.02, y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                {/* 图标 */}
                <div className={`p-4 rounded-xl bg-gradient-to-br ${link.color} text-white`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* 信息 */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-1">
                    {link.name}
                  </h3>
                  <p className="text-white font-medium group-hover:text-[#667eea] transition-colors">
                    {link.value}
                  </p>
                </div>

                {/* 箭头 */}
                <motion.div
                  className="ml-auto text-gray-500 group-hover:text-white transition-colors"
                  initial={{ x: 0 }}
                  whileHover={{ x: 5 }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.div>
              </motion.a>
            );
          })}
        </motion.div>

        {/* 底部提示 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-gray-500 text-sm">
            期待与您的交流！无论是项目合作还是技术讨论，我都很乐意倾听。
          </p>
        </motion.div>
      </div>
    </section>
  );
}
