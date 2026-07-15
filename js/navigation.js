const navButtons = document.querySelectorAll(".nav-button");
const appPages = document.querySelectorAll(".app-page");
const pageTitle = document.getElementById("page-title");

navButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    const selectedPage = button.dataset.page;

    navButtons.forEach(function(navButton) {
      navButton.classList.remove("active");
    });

    appPages.forEach(function(page) {
      page.hidden = true;
      page.classList.remove("active-page");
    });

    button.classList.add("active");

    const pageToShow = document.getElementById(
      `${selectedPage}-page`
    );

    if (pageToShow) {
      pageToShow.hidden = false;
      pageToShow.classList.add("active-page");
    }

    pageTitle.textContent = button.textContent.trim();
  });
});