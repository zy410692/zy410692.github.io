(function () {
  const site = window.SITE || { title: "沈阳市浑南区吃喝玩乐", lede: "" };
  document.title = site.title;
  const h1 = document.querySelector("h1");
  const lede = document.querySelector(".lede");
  if (h1) h1.textContent = site.title;
  if (lede) lede.textContent = site.lede || "输入店名或地址就能筛出卡片，也能按标签点选。";

  const places = window.PLACES || [];
  const tagBar = document.getElementById("tag-bar");
  const cards = document.getElementById("place-cards");
  const searchInput = document.getElementById("place-search");
  const searchHint = document.getElementById("search-hint");
  let activeTag = "全部";
  let query = "";

  function allTags() {
    const set = new Set();
    places.forEach(function (place) {
      (place.tags || []).forEach(function (tag) { set.add(tag); });
    });
    return ["全部"].concat(Array.from(set).sort());
  }

  function haystack(place) {
    return [
      place.name || "",
      place.area || "",
      place.address || "",
      place.blurb || "",
      (place.tags || []).join(" "),
    ].join(" ").toLowerCase();
  }

  function matchesQuery(place) {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    // support multi keywords (space separated, all must match)
    const parts = q.split(/\s+/).filter(Boolean);
    const text = haystack(place);
    return parts.every(function (part) { return text.indexOf(part) !== -1; });
  }

  function filteredPlaces() {
    return places.filter(function (place) {
      if (!matchesQuery(place)) return false;
      if (activeTag === "全部") return true;
      return (place.tags || []).indexOf(activeTag) !== -1;
    });
  }

  function renderTags() {
    if (!tagBar) return;
    tagBar.innerHTML = "";
    allTags().forEach(function (tag) {
      const btn = el("button", {
        type: "button",
        class: "tag-btn" + (tag === activeTag ? " is-active" : ""),
        "aria-pressed": tag === activeTag ? "true" : "false",
      }, [tag]);
      btn.addEventListener("click", function () {
        activeTag = tag;
        renderTags();
        renderCards();
      });
      tagBar.append(btn);
    });
  }

  function renderCards() {
    if (!cards) return;
    cards.innerHTML = "";
    const filtered = filteredPlaces();
    if (searchHint) {
      if (query.trim()) {
        searchHint.hidden = false;
        searchHint.textContent = "搜到 " + filtered.length + " 张卡片" +
          (activeTag !== "全部" ? "（标签：" + activeTag + "）" : "");
      } else {
        searchHint.hidden = true;
        searchHint.textContent = "";
      }
    }
    if (!filtered.length) {
      cards.append(el("p", { class: "pending" }, [
        query.trim()
          ? "没有匹配「" + query.trim() + "」的卡片，换个关键词试试。"
          : "这个标签下暂时没有店铺。",
      ]));
      return;
    }
    filtered.forEach(function (place) {
      const tagRow = el("div", { class: "card-tags" }, (place.tags || []).map(function (tag) {
        return el("span", { class: "chip" }, [tag]);
      }));
      const children = [];
      if (place.image) {
        children.push(el("img", {
          class: "card-img",
          src: place.image,
          alt: (place.name || "") + "店面",
          loading: "lazy",
        }));
      } else if (place.imageNote) {
        children.push(el("div", { class: "card-img-ph" }, [place.imageNote]));
      }
      const visit = place.visitStatus || (place.explored === false ? "等待博主去探店" : (place.explored ? "已探店" : ""));
      const titleRow = el("div", { class: "card-title-row" }, [
        el("h3", { class: "card-title" }, [place.name]),
        visit ? el("span", {
          class: "visit-badge" + (visit === "已探店" ? " is-done" : (visit === "等待博主去探店" ? " is-wait" : " is-note")),
        }, [visit]) : null,
      ]);
      children.push(
        titleRow,
        el("p", { class: "card-meta" }, [place.area || "", place.area ? " · " : "", place.address || ""]),
        el("p", { class: "card-blurb" }, [place.blurb || ""]),
        tagRow
      );
      if (place.postId) {
        children.push(el("a", {
          class: "card-link",
          href: "post.html?id=" + encodeURIComponent(place.postId),
        }, ["看实测短评 →"]));
      }
      const cardClass = "place-card" + (visit === "等待博主去探店" ? " is-wait" : "");
      cards.append(el("article", { class: cardClass, "data-id": place.id, "data-visit": visit || "" }, children));
    });
  }

  if (searchInput) {
    // restore from URL ?q=
    const params = new URLSearchParams(location.search);
    const q0 = params.get("q");
    if (q0) {
      query = q0;
      searchInput.value = q0;
    }
    let timer = null;
    searchInput.addEventListener("input", function () {
      query = searchInput.value || "";
      clearTimeout(timer);
      timer = setTimeout(function () {
        const url = new URL(location.href);
        if (query.trim()) url.searchParams.set("q", query.trim());
        else url.searchParams.delete("q");
        history.replaceState(null, "", url.pathname + url.search + url.hash);
        renderCards();
      }, 120);
    });
  }

  renderTags();
  renderCards();

  const posts = (window.POSTS || []).slice().sort(function (a, b) {
    return String(b.date).localeCompare(String(a.date));
  });
  const list = document.getElementById("list");
  const banner = document.getElementById("demo-banner");
  if (banner && posts.length && posts.every(function (post) { return post.demo; })) {
    banner.hidden = false;
  }
  if (!list) return;
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
