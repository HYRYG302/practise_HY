import { motion } from 'framer-motion';
import { skills, skillCategories } from '../data/skills';

/**
 * About 组件 - 关于我区域
 * 包含个人介绍和技能列表
 */
export default function About() {
  // 按类别分组技能
  const groupedSkills = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, typeof skills>);

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
      id="about"
      className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-6xl mx-auto">
        {/* 标题 */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            关于<span className="bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">我</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#667eea] to-[#764ba2] mx-auto rounded-full" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          {/* 个人介绍 */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-white">个人简介</h3>
            <div className="space-y-4 text-gray-400 leading-relaxed">
              <p>
                我是一名充满热情的全栈开发工程师，拥有 5 年以上的开发经验。
                专注于构建高性能、可扩展的 Web 应用程序。
              </p>
              <p>
                在工作中，我注重代码质量和用户体验，善于将复杂的问题分解为可管理的模块。
                我相信好的软件不仅要功能完善，还要易于维护和扩展。
              </p>
              <p>
                除了编程，我还热衷于学习新技术和分享知识。
                经常参与开源项目，并在技术社区发表文章。
              </p>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              {[
                { number: '5+', label: '年经验' },
                { number: '50+', label: '项目完成' },
                { number: '20+', label: '技术栈' }
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  className="text-center p-4 bg-white/5 rounded-lg"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-[#667eea] to-[#764ba2] bg-clip-text text-transparent">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* 技能列表 */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-white">技能专长</h3>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                <motion.div key={category} variants={itemVariants}>
                  <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-3">
                    {skillCategories[category as keyof typeof skillCategories]}
                  </h4>
                  <div className="space-y-3">
                    {categorySkills.map((skill) => (
                      <div key={skill.name}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-300">{skill.name}</span>
                          <span className="text-sm text-gray-500">{skill.level}%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.level}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-gradient-to-r from-[#667eea] to-[#764ba2] rounded-full"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
