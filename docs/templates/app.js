document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#menu-btn");
  const sidebar = document.querySelector(".shadriz-sidebar");
  const shadrizDocs = document.querySelector(".shadriz-docs");
  menuBtn.addEventListener("click", () => {
    if (sidebar.classList.contains("hidden")) {
      sidebar.classList.remove("hidden");
      shadrizDocs.classList.add("hidden");
    } else {
      sidebar.classList.add("hidden");
      shadrizDocs.classList.remove("hidden");
    }
  });

  sidebar.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      sidebar.classList.add("hidden");
      shadrizDocs.classList.remove("hidden");
    }
  });
});
