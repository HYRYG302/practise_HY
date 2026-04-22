// 项目数据
export interface Project {
  id: number;
  name: string;
  description: string;
  image: string;
  techStack: string[];
  link: string;
  github?: string;
  highlights?: string[];
  achievements?: string[];
}

export const projects: Project[] = [
  {
    id: 1,
    name: "安捷伦科技公司微信售后小程序/微商城",
    description: "安捷伦微信小程序和安捷伦微商城是安捷伦为其用户提供专业售后或服务的在线服务平台，结合了 Vue.js 前端框架，Node.js 和 Jitterbit 集成平台，旨在实现高效的数据同步与用户交互。系统与 CRM 平台深度集成，支持多终端访问与高并发场景下的稳定运行。",
    image: "/agilent-wechat.png",
    techStack: ["Vue", "Node.js", "Jitterbit", "微信小程序", "SAP HANA", "IBM DB2", "OKTA"],
    link: "#",
    highlights: [
      "Jitterbit接口开发：负责使用 Jitterbit 开发数据集成接口，确保从不同数据源（如 SAP HANA 和 IBM DB2）到微信小程序的数据流转准确无误",
      "安全认证集成：成功集成 OKTA 认证服务，保障了系统的安全性，实现了单点登录（SSO）功能",
      "Node微服务架构：利用 Node.js 构建轻量级的微服务，为前端提供稳定且高效的API接口支持",
      "跨系统数据同步：设计并实现了数据同步逻辑，验证了 Jitterbit 平台在实时数据同步中的性能与准确性",
      "数据库优化：对 SAP HANA 和 IBM DB2 进行查询优化，提高了数据同步效率，减少响应延迟"
    ],
    achievements: [
      "成功搭建了一个高效的数据集成平台，通过 Jitterbit 实现了多数据源的无缝对接",
      "该项目获得了公司内部的创新奖，为后续项目提供了宝贵经验"
    ]
  },
  {
    id: 2,
    name: "保交所产品交易系统",
    description: "保交所产品交易系统是一个高可用性的保险交易平台，采用微服务架构支持在线交易和服务。负责后端开发及系统性能优化，并积极参与自动化测试和监控策略的设计与实施。",
    image: "/baojiaosuo.png",
    techStack: ["Spring Boot", "MyBatis", "Dubbo", "RocketMQ", "Redis", "Nginx", "Angular"],
    link: "#",
    highlights: [
      "使用 Spring Boot 和 MyBatis 开发核心业务逻辑，优化了数据访问层",
      "通过 Dubbo 实现高效的服务调用，利用 RocketMQ 处理异步消息，提升了系统响应速度",
      "配置 Redis 缓存热点数据，减轻数据库负载；设置 Nginx 实现负载均衡",
      "协同前端团队基于 Angular 完成动态交互页面的开发，确保前后端无缝对接",
      "应用 Postman 进行接口测试，使用 JMeter 执行压力测试，发现并解决了多个性能瓶颈",
      "利用 Prometheus 和 Grafana 监控系统健康状态，提供了实时可视化监控"
    ],
    achievements: [
      "自动化测试覆盖率提升，显著提高了产品质量和开发效率",
      "识别数据库连接泄漏问题，优化数据库设计后响应时间降低65%",
      "系统稳定性增强，平均故障恢复时间大幅缩短"
    ]
  },
  {
    id: 3,
    name: "中宏保险微信小程序后端",
    description: "负责为成都前端团队开发并维护微信小程序后端接口，支持小程序的核心功能实现。采用 Spring Boot 快速搭建微服务架构，结合 MyBatis 实现高效的数据持久化操作，确保接口性能和稳定性。",
    image: "/zhonghong.png",
    techStack: ["Spring Boot", "MyBatis", "微信小程序", "Swagger"],
    link: "#",
    highlights: [
      "使用 Spring Boot 构建 RESTful API，提供稳定、高效的接口服务，支持前端微信小程序的核心功能（如用户登录、数据查询、订单处理等）",
      "利用 MyBatis 优化复杂 SQL 查询，提升数据库访问效率，减少接口响应时间",
      "设计并实现了多模块化的后端服务，便于后续扩展和维护",
      "与前端团队紧密协作，确保接口设计符合需求，并通过文档和Mock工具（如Swagger）提前交付接口规范",
      "针对高并发场景优化接口性能，确保系统在高峰期的稳定性"
    ],
    achievements: [
      "成功交付了 70 多个核心接口",
      "接口平均响应时间控制在 30 毫秒以内，显著提升了用户体验",
      "系统上线后运行稳定，未出现重大故障，获得前端团队的高度认可"
    ]
  }
];
