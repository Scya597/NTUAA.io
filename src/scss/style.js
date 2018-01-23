document.addEventListener('click', (e) => {
  const c = e.target.className;
  if (c === 'loginOnlineDraw') {
    document.querySelector('.loginOnline').classList.toggle('open');
  }
});
