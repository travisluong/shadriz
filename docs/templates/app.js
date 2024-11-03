document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#menu-btn");
  const sidebar = document.querySelector(".shadts-sidebar");
  const shadtsDocs = document.querySelector(".shadts-docs");
  menuBtn.addEventListener("click", () => {
    if (sidebar.classList.contains("hidden")) {
      sidebar.classList.remove("hidden");
      shadtsDocs.classList.add("hidden");
    } else {
      sidebar.classList.add("hidden");
      shadtsDocs.classList.remove("hidden");
    }
  });

  sidebar.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      sidebar.classList.add("hidden");
      shadtsDocs.classList.remove("hidden");
    }
  });
});
