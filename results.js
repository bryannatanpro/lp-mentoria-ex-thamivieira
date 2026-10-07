const resultDialog = document.getElementById('result-dialog');
const expandedResult = document.getElementById('result-expanded');
document.querySelectorAll('[data-result]').forEach(button => {
  button.addEventListener('click', () => {
    expandedResult.src = button.dataset.result;
    expandedResult.alt = button.querySelector('img').alt;
    document.getElementById('result-caption').textContent = button.dataset.caption;
    resultDialog.showModal();
  });
});
document.querySelectorAll('.result-close,.result-dismiss').forEach(button => button.addEventListener('click', () => resultDialog.close()));
resultDialog.addEventListener('click', event => {
  if (event.target !== resultDialog) return;
  const rect = resultDialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) resultDialog.close();
});
