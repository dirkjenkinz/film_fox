$(window).on('load', function () {
  $('#nav-categories').addClass('active');
});

const getTitle = () => $('#filmTitle')[0]?.innerText || '';
const getNumber = (elementId) => $(elementId)[0]?.innerText || '';

const buildUrl = (call, sceneNumber = '', elementNumber = '') => {
  const title = getTitle();
  sceneNumber = sceneNumber || getNumber('#sceneNumber');
  elementNumber = elementNumber || getNumber('#elementNumber');
  return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
};

$('.btn-delete-category').on('click', (e) => {
  if (confirm('Are you sure you want to delete this category?')) {
    const title = $('#filmTitle')[0].innerText;
  const category = e.target.value;
  const url = buildUrl('delete-category', '', '');
  window.location.href = element ? `${url}&category=${category}` : url;
  };
});

$('#btn-add-category').on('click', () => {
  const category = $('#input-category')[0].value;
  if (category !== '') {
    const url = buildUrl('add-category', '', '');
    window.location.href = `${url}&category=${category}`;
  }
});

$('.btn-display-category').on('click', (e) => {
  const category = e.target.value;
  const url = buildUrl('categories', '', '');
  window.location.href = `${url}&category=${category}`;
});

$('#btn-display-all').on('click', () => {
  const category = '';
  const url = buildUrl('categories', '', '');
  window.location.href = `${url}&category=${category}`;
});
