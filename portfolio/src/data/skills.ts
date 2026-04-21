// 技能数据
export interface Skill {
  name: string;
  level: number; // 1-100
  category: "frontend" | "backend" | "tools" | "other";
}

export const skills: Skill[] = [
  // 前端技能
  { name: "React", level: 90, category: "frontend" },
  { name: "TypeScript", level: 85, category: "frontend" },
  { name: "Vue.js", level: 80, category: "frontend" },
  { name: "Tailwind CSS", level: 88, category: "frontend" },
  { name: "Next.js", level: 75, category: "frontend" },
  
  // 后端技能
  { name: "Node.js", level: 78, category: "backend" },
  { name: "Python", level: 70, category: "backend" },
  { name: "PostgreSQL", level: 72, category: "backend" },
  { name: "MongoDB", level: 68, category: "backend" },
  
  // 工具
  { name: "Git", level: 85, category: "tools" },
  { name: "Docker", level: 65, category: "tools" },
  { name: "Figma", level: 70, category: "tools" },
  { name: "VS Code", level: 90, category: "tools" },
  
  // 其他
  { name: "UI/UX Design", level: 75, category: "other" },
  { name: "Agile/Scrum", level: 80, category: "other" }
];

export const skillCategories = {
  frontend: "前端开发",
  backend: "后端开发",
  tools: "开发工具",
  other: "其他技能"
};
