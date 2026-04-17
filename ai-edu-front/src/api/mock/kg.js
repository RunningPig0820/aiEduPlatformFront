/**
 * 知识图谱 Mock 数据
 * 用于前端先行开发和调试，后端 API 就绪后替换
 */

export const mockTextbooks = [
  { uri: "kg:textbook:pep-math", name: "人教版", subject: "数学" },
  { uri: "kg:textbook:pep-chinese", name: "人教版", subject: "语文" },
  { uri: "kg:textbook:pep-english", name: "人教版", subject: "英语" },
];

export const mockChapters = [
  { uri: "kg:chapter:1", name: "第一单元", textbookUri: "kg:textbook:pep-math" },
  { uri: "kg:chapter:2", name: "第二单元", textbookUri: "kg:textbook:pep-math" },
  { uri: "kg:chapter:3", name: "第三单元", textbookUri: "kg:textbook:pep-math" },
];

export const mockSections = [
  { uri: "kg:section:1", name: "第一课时", chapterUri: "kg:chapter:1" },
  { uri: "kg:section:2", name: "第二课时", chapterUri: "kg:chapter:1" },
  { uri: "kg:section:3", name: "第一课时", chapterUri: "kg:chapter:2" },
];

export const mockPoints = [
  {
    uri: "kg:point:1",
    name: "数的认识",
    sectionUri: "kg:section:1",
    subject: "数学",
    grade: "七年级",
  },
  {
    uri: "kg:point:2",
    name: "整数的加法",
    sectionUri: "kg:section:1",
    subject: "数学",
    grade: "七年级",
  },
  {
    uri: "kg:point:3",
    name: "分数的概念",
    sectionUri: "kg:section:2",
    subject: "数学",
    grade: "七年级",
  },
];

export const mockPointDetail = {
  uri: "kg:point:1",
  name: "数的认识",
  subject: "数学",
  grade: "七年级",
  unit: "第一单元",
  lesson: "第一课时",
  difficulty: 2,
  cognitiveLevel: "理解",
};

export const mockGraphData = {
  nodes: [
    {
      id: "kg:point:1",
      type: "textbook_kp",
      label: "数的认识",
      data: {
        uri: "kg:point:1",
        name: "数的认识",
        subject: "数学",
        grade: "七年级",
        unit: "第一单元",
        lesson: "第一课时",
      },
    },
    {
      id: "kg:point:101",
      type: "kp",
      label: "自然数",
      data: {
        uri: "kg:point:101",
        name: "自然数",
        subject: "数学",
        difficulty: 1,
        cognitiveLevel: "记忆",
      },
    },
    {
      id: "kg:point:102",
      type: "kp",
      label: "整数",
      data: {
        uri: "kg:point:102",
        name: "整数",
        subject: "数学",
        difficulty: 2,
        cognitiveLevel: "理解",
      },
    },
    {
      id: "kg:point:103",
      type: "kp",
      label: "分数",
      data: {
        uri: "kg:point:103",
        name: "分数",
        subject: "数学",
        difficulty: 3,
        cognitiveLevel: "应用",
      },
    },
  ],
  edges: [
    {
      id: "edge-1",
      source: "kg:point:1",
      target: "kg:point:101",
      label: "包含",
    },
    {
      id: "edge-2",
      source: "kg:point:1",
      target: "kg:point:102",
      label: "包含",
    },
    {
      id: "edge-3",
      source: "kg:point:1",
      target: "kg:point:103",
      label: "关联",
    },
    {
      id: "edge-4",
      source: "kg:point:101",
      target: "kg:point:102",
      label: "前置",
    },
  ],
};
