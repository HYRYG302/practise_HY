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
                拥有十五年IT领域经验，其中十年深耕软件开发，涵盖后台与应用软件开发，参与和主导过保险、医药、旅游等多个行业的软件开发项目。全程参与软件开发生命周期，具备微服务治理、高并发优化等核心技术能力，能够有效解决技术难题并推动项目顺利落地。
              </p>
              <p>
                此外，四年微信小程序项目管理经验，持有信息系统项目管理师和PMP认证，熟悉项目管理工具（如Project、Jira、禅道、Redmine等），同时具备流程优化能力，以技术驱动项目管理，打造过成熟高效的研发团队，助力提升项目效率与成功率，为团队与客户创造价值。
              </p>
            </div>

            {/* 统计数据 */}
            <div className="grid grid-cols-3 gap-6 mt-8">
              {[
                { number: '15+', label: '年IT经验' },
                { number: '10+', label: '年软件开发' },
                { number: '4+', label: '年项目管理' }
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
