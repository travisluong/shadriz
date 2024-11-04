document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#menu-btn");
  const sidebar = document.querySelector(".shadrizz-sidebar");
  const shadrizzDocs = document.querySelector(".shadrizz-docs");
  menuBtn.addEventListener("click", () => {
    if (sidebar.classList.contains("hidden")) {
      sidebar.classList.remove("hidden");
      shadrizzDocs.classList.add("hidden");
    } else {
      sidebar.classList.add("hidden");
      shadrizzDocs.classList.remove("hidden");
    }
  });

  sidebar.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      sidebar.classList.add("hidden");
      shadrizzDocs.classList.remove("hidden");
    }
  });
});
