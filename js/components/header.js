/* ============================================================
   SMRITI — Header Component
   Safe SPA Hash Routing for Logo and Title without ReferenceError
   ============================================================ */

export function setupHeaderRouting(headerElement) {
  if (!headerElement) return;

  const logoElement = headerElement.querySelector('#app-logo') || headerElement.querySelector('.header-logo');
  const titleElement = headerElement.querySelector('#app-title') || headerElement.querySelector('.header-title');
  const brandElement = headerElement.querySelector('#app-brand') || headerElement.querySelector('.header-brand');

  const onNavigateHome = (e) => {
    if (e) e.preventDefault();
    window.location.hash = '#/';
  };

  if (logoElement) {
    logoElement.addEventListener('click', onNavigateHome);
  }
  if (titleElement) {
    titleElement.addEventListener('click', onNavigateHome);
  }
  if (brandElement) {
    brandElement.addEventListener('click', onNavigateHome);
  }
}

export default setupHeaderRouting;
