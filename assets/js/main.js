const yearElement = document.querySelector("[data-year]");
const birthdayDialog = document.querySelector(".birthday-dialog");
const closeButtons = document.querySelectorAll("[data-close-dialog]");

if (yearElement) yearElement.textContent = `© ${new Date().getFullYear()} Psykin`;

if (birthdayDialog) {
  birthdayDialog.showModal();
  closeButtons.forEach((button) => button.addEventListener("click", () => birthdayDialog.close()));
  birthdayDialog.addEventListener("click", (event) => {
    if (event.target === birthdayDialog) birthdayDialog.close();
  });
}
