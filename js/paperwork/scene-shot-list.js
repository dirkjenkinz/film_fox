$(() => {
  // Add 'active' class to the navigation link for scene-shot-list
  $('#nav-scene-shot-list').addClass('active');
});

// Function to build URL for various calls with optional scene and element numbers
const buildUrl = (call, sceneNumber, elementNumber) => {
  const title = $('#filmTitle')[0].innerText;

  // Set default scene and element numbers if not provided
  if (sceneNumber === '') {
    sceneNumber = $('#sceneNumber')[0].innerText;
  }
  if (elementNumber === '') {
    elementNumber = $('#elementNumber')[0].innerText;
  }

  return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
};

// Event listener for slider input change
$('#slider-scene').on('input', (e) => {
  // Update the displayed scene number
  $('#output')[0].innerText = e.target.value;
});

// Event listener for slider change
$('#slider-scene').on('change', (e) => {
  const sceneNumber = e.target.value;
  const url = buildUrl('scene-shot-list', sceneNumber, '');
  window.location.href = url;
});

// Event listener for shot select change
$('.shot-select').on('change', (e) => {
  const line = e.target.id;
  const val = e.target.value;
  let l1 = line.substring(5).split('_');
  const url = buildUrl('update-shot-list', '', '');
  window.location.href = `${url}&val=${val}&item=${l1[0]}&line=${l1[1]}`;
});

// Event listener for shot subject focus out
$('.shot-subject').on('focusout', (e) => {
  const line = e.target.id.substring(13);
  const val = e.target.value;
  const url = buildUrl('update-shot-list', '', '');
  window.location.href = `${url}&val=${val}&item=subject&line=${line}`;
});

// Event listener for shot description change
$('.shot-description').on('change', (e) => {
  const line = e.target.id.substring(17);
  const val = e.target.value;
  const url = buildUrl('update-shot-list', '', '');
  window.location.href = `${url}&val=${val}&item=description&line=${line}`;
});

// Event listener for next scene button click
$('.btn-next').on('click', (e) => {
  const title = $('#filmTitle')[0].outerText;
  const sceneNumber = parseInt($('#sceneNumber')[0].outerText) + 1;
  window.location.href = `/scene-shot-list?title=${title}&sceneNumber=${sceneNumber}&elementNumber=0`;
});

// Event listener for previous scene button click
$('.btn-previous').on('click', (e) => {
  const title = $('#filmTitle')[0].outerText;
  const sceneNumber = parseInt($('#sceneNumber')[0].outerText) - 1;
  window.location.href = `/scene-shot-list?title=${title}&sceneNumber=${sceneNumber}&elementNumber=0`;
});

// Event listener for add shot button click
$('.btn-add-shot').on('click', (e) => {
  const line = e.target.value;
  const title = $('#filmTitle')[0].outerText;
  const sceneNumber = $('#sceneNumber')[0].outerText;
  window.location.href = `/add-shot?title=${title}&sceneNumber=${sceneNumber}&elementNumber=0&line=${line}`;
});

// Event listener for delete shot button click
$('.btn-delete-shot').on('click', (e) => {
  const line = e.target.value;
  const title = $('#filmTitle')[0].outerText;
  const sceneNumber = $('#sceneNumber')[0].outerText;
  window.location.href = `/delete-shot?title=${title}&sceneNumber=${sceneNumber}&elementNumber=0&line=${line}`;
});

// Event listener for input note focus out
$('#input-note').on('focusout', (e) => {
  const val = e.target.value;
  const title = $('#filmTitle')[0].outerText;
  const sceneNumber = $('#sceneNumber')[0].outerText;
  window.location.href = `/update-note?title=${title}&sceneNumber=${sceneNumber}&elementNumber=0&val=${val}&caller=shot-list`;
});
