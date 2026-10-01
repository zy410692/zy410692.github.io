(function () {
  const site = window.SITE || { title: "笔记", lede: "" };
  document.title = site.title;
  document.querySelector("h1").textContent = site.title;
  document.querySelector(".lede").textContent = site.lede;

  const posts = (window.POSTS || []).slice().sort(function (a, b) {
    return String(b.date).localeCompare(String(a.date));
  });
  const list = document.getElementById("list");
  const banner = document.getElementById("demo-banner");
  if (posts.length && posts.every(function (post) { return post.demo; })) {
    banner.hidden = false;
  }
  if (!posts.length) {
    list.append(el("p", { class: "pending" }, ["还没有文章。"]));
    return;
  }
  posts.forEach(function (post) {
    list.append(el("a", {
      class: "item",
      href: "post.html?id=" + encodeURIComponent(post.id),
    }, [
      el("time", { datetime: post.date }, [post.date]),
      el("h2", {}, [post.title]),
      post.summary ? el("p", {}, [post.summary]) : null,
    ]));
  });
})();
