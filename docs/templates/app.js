document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#menu-btn");
  const sidebar = document.querySelector(".shadjs-sidebar");
  const shadjsDocs = document.querySelector(".shadjs-docs");
  menuBtn.addEventListener("click", () => {
    if (sidebar.classList.contains("hidden")) {
      sidebar.classList.remove("hidden");
      shadjsDocs.classList.add("hidden");
    } else {
      sidebar.classList.add("hidden");
      shadjsDocs.classList.remove("hidden");
    }
  });

  sidebar.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      sidebar.classList.add("hidden");
      shadjsDocs.classList.remove("hidden");
    }
  });
});
