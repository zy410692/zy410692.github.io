(function () {
  const site = window.SITE || { title: "笔记" };
  const id = new URLSearchParams(location.search).get("id");
  const post = findPost(id);
  const main = document.getElementById("article");

  main.append(el("a", { class: "brand", href: "index.html" }, [site.title]));

  if (!post) {
    document.title = "没有这篇文章 · " + site.title;
    main.append(
      el("h1", {}, ["没有这篇文章"]),
      el("p", { class: "pending" }, ["回到首页再打开。"])
    );
    return;
  }

  document.title = post.title + " · " + site.title;
  if (post.demo) {
    main.append(el("p", { class: "demo" }, ["这是一篇示例。"]));
  }
  main.append(
    el("h1", {}, [post.title]),
    el("time", { class: "date", datetime: post.date }, [post.date])
  );
  const body = el("div", { class: "body" });
  (post.paragraphs || []).forEach(function (paragraph) {
    body.append(el("p", {}, [paragraph]));
  });
  main.append(body);
  mountComments("post.html?id=" + post.id);
})();
