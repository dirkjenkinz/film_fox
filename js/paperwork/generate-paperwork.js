$(document).ready(() => {
  // Add 'active' class to the 'nav-report' element
  $('#nav-generate-paperwork').addClass('active');
});

$('#btn-powerpoint').on('click', () => {
  const title = $('#filmTitle')[0].innerText;
  window.location.href = `/generate-powerpoint?title=${title}`;
});

$('#btn-shot-spreadsheets').on('click', () => {
  const title = $('#filmTitle')[0].innerText;
  window.location.href = `/generate-shot-spreadsheets?title=${title}`;
});

$('#btn-shot-pdfs').on('click', () => {
  console.log('@@@@')
  const title = $('#filmTitle')[0].innerText;
  window.location.href = `/generate-shot-pdfs?title=${title}`;
});

$('#btn-scene-list-spreadsheet').on('click', () => {
  const title = $('#filmTitle')[0].innerText;
  window.location.href = `/generate-scene-list-spreadsheet?title=${title}`;
});

$('.btn-directory').on('click', (e) => {
  let directory = (e.target.value);
  directory = directory.substring(4);
  const title = $('#filmTitle')[0].innerText;
  window.location.href = `/generate-paperwork?title=${title}&directory=${directory}`;
});
