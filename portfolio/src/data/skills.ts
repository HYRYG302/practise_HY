// 技能数据
export interface Skill {
  name: string;
  level: number; // 1-100
  category: "java" | "framework" | "database" | "middleware" | "cloud" | "tools" | "certification";
}

export const skills: Skill[] = [
  // Java基础
  { name: "Java基础/集合/多线程", level: 95, category: "java" },
  
  // 框架
  { name: "Spring/Spring MVC", level: 92, category: "framework" },
  { name: "Spring Boot", level: 93, category: "framework" },
  { name: "MyBatis", level: 88, category: "framework" },
  { name: "Spring Cloud", level: 85, category: "framework" },
  
  // 数据库
  { name: "MySQL", level: 90, category: "database" },
  { name: "Redis", level: 88, category: "database" },
  { name: "SAP HANA", level: 80, category: "database" },
  { name: "IBM DB2", level: 78, category: "database" },
  
  // 消息中间件
  { name: "RocketMQ", level: 85, category: "middleware" },
  { name: "Dubbo", level: 82, category: "middleware" },
  
  // 运维与工具
  { name: "Nginx", level: 80, category: "tools" },
  { name: "Docker", level: 75, category: "tools" },
  { name: "Jira/禅道/Redmine", level: 88, category: "tools" },
  { name: "CI/CD", level: 82, category: "tools" },
  
  // 前端
  { name: "Vue.js", level: 75, category: "cloud" },
  { name: "微信小程序", level: 85, category: "cloud" },
  { name: "Node.js", level: 78, category: "cloud" },
  
  // 认证
  { name: "PMP项目管理认证", level: 95, category: "certification" },
  { name: "信息系统项目管理师", level: 95, category: "certification" }
];

export const skillCategories = {
  java: "Java基础",
  framework: "框架技术",
  database: "数据库",
  middleware: "消息中间件",
  cloud: "前端与小程序",
  tools: "运维与工具",
  certification: "专业认证"
};
