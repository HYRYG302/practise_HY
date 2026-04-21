// 项目数据
export interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  techStack: string[];
  link: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    name: "电商后台管理系统",
    description: "一个功能完善的电商后台管理系统，包含商品管理、订单处理、数据分析等模块。",
    image: "/project1.jpg",
    techStack: ["React", "TypeScript", "Ant Design", "Redux Toolkit"],
    link: "https://example.com/project1",
    github: "https://github.com/example/project1"
  },
  {
    id: 2,
    name: "个人博客系统",
    description: "基于 Next.js 开发的个人博客系统，支持 Markdown 编辑、代码高亮、评论功能。",
    image: "/project2.jpg",
    techStack: ["Next.js", "TypeScript", "Tailwind CSS", "Prisma"],
    link: "https://example.com/project2",
    github: "https://github.com/example/project2"
  },
  {
    id: 3,
    name: "任务管理应用",
    description: "简洁高效的任务管理工具，支持拖拽排序、标签分类、进度追踪等功能。",
    image: "/project3.jpg",
    techStack: ["Vue 3", "TypeScript", "Pinia", "Element Plus"],
    link: "https://example.com/project3",
    github: "https://github.com/example/project3"
  },
  {
    id: 4,
    name: "数据可视化大屏",
    description: "企业级数据可视化大屏，实时展示业务数据，支持多种图表类型。",
    image: "/project4.jpg",
    techStack: ["React", "ECharts", "WebSocket", "Node.js"],
    link: "https://example.com/project4"
  }
];
