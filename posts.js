window.SITE = {
  title: "笔记",
  lede: "写点东西，文末可以评论。",
};

/**
 * 加一篇：复制下面这一条，改 id、title、date、paragraphs。
 * id 用英文和短横线，不能重复。
 * demo 为 true 时，页面会标明这是示例。你的文章写成 false。
 * 一段文字放进 paragraphs 里的一个字符串。
 */
window.POSTS = [
  {
    id: "sample",
    demo: true,
    title: "示例：把这篇换成你的文章",
    date: "2026-09-29",
    summary: "占位用的，换成你的文章后再发出去。",
    paragraphs: [
      "这是一篇示例，不是正文。",
      "标题和这些段落都可以换掉。读者从这里往下读，读完在文末评论。",
      "每一篇的评论是分开的。",
    ],
  },
];
