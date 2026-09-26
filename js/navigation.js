function go(page){
  history.pushState({},'',`#${page}`);
  render(page);
  document.querySelector(".mobileLinks")?.classList.remove("open");
}