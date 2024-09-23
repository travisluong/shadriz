document.addEventListener("DOMContentLoaded", () => {
  const menuBtn = document.querySelector("#menu-btn");
  const sidebar = document.querySelector(".shadriz-sidebar");
  const darkBtn = document.querySelector("#dark-btn");
  menuBtn.addEventListener("click", () => {
    console.log("menu clicked");

    if (!sidebar.classList.contains("active")) {
      sidebar.classList.add("active");
    } else {
      sidebar.classList.remove("active");
    }
  });

  sidebar.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      sidebar.classList.remove("active");
    }
  });

  darkBtn.addEventListener("click", () => {
    if (document.body.classList.contains("dark")) {
      document.body.classList.remove("dark");
      darkBtn.innerHTML = "Dark";
    } else {
      document.body.classList.add("dark");
      darkBtn.innerHTML = "Light";
    }
  });
});
