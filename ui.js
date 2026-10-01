function el(tag, attrs, children) {
  const node = document.createElement(tag);
  Object.keys(attrs || {}).forEach(function (key) {
    const value = attrs[key];
    if (value == null || value === false) return;
    if (key === "class") node.className = value;
    else node.setAttribute(key, value);
  });
  (children || []).forEach(function (child) {
    if (child == null || child === false) return;
    node.append(child instanceof Node ? child : document.createTextNode(String(child)));
  });
  return node;
}

function findPost(id) {
  return (window.POSTS || []).find(function (post) {
    return post.id === id;
  });
}

function mountComments(path) {
  const main = document.getElementById("article");
  if (!main) return;
  const root = el("section", { id: "comments", "aria-label": "评论" });
  main.append(root);
  root.append(el("h2", {}, ["评论"]));
  const envId = String(window.COMMENT_ENV_ID || "").trim();
  if (!envId) {
    root.append(el("p", { class: "pending" }, ["评论即将开放。"]));
    return;
  }
  root.append(el("div", { id: "tcomment" }));
  const script = document.createElement("script");
  script.src = "vendor/twikoo.min.js";
  script.onload = function () {
    window.twikoo.init({
      envId: envId,
      el: "#tcomment",
      path: path,
      lang: "zh-CN",
    });
  };
  document.body.append(script);
}
