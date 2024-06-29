// Function to build the URL for various actions
const buildUrl = (call, sceneNumber, elementNumber, speak) => {
  const title = $('#filmTitle')[0].innerText;
  return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}&speak=${speak}`;
};

$(() => {
  // Set 'Showreel' as active navigation
  $('#nav-showreel').addClass('active');
});

$('#slider-scene').on('input', (e) => {
  // Update input elements based on slider value
  const slugList = $('#slugList')[0].innerText.split('@@');
  const slug = slugList[e.target.value].substring(1);
  const noteList = $('#noteList')[0].innerText.split('@@');
  const note = noteList[e.target.value].substring(1);

  // Set input values
  $('#input-note')[0].value = note;
  $('#output')[0].innerText = `${e.target.value}:- ${slug}`;
});

$('#slider-scene').on('change', (e) => {
  // Handle slider change for 'Showreel'
  const sceneNumber = e.target.value;
  const url = buildUrl('showreel', sceneNumber, 0, 'yes');
  window.location.href = url;
});

// Handle keyboard navigation
$(document).keydown((e) => {
  const keyCode = e.keyCode || e.which;

  switch (keyCode) {
    case 37: // Left Arrow Key
      $('#btn-previous-element').trigger('click');
      break;
    case 39: // Right Arrow Key
      $('#btn-next-element').trigger('click');
      break;
  }
});

// Event handlers for navigation buttons
$('#btn-next-element').on('click', () => {
  const currentElementNumber = parseInt($('#elementNumber')[0].innerText);
  const highestElementNumber = parseInt($('#highestElement')[0].innerText);

  if (currentElementNumber < highestElementNumber) {
    const elementNumber = currentElementNumber + 1;
    const sceneNumber = parseInt($('#sceneNumber')[0].innerText);
    const url = buildUrl('showreel', sceneNumber, elementNumber, 'yes');
    window.location.href = url;
  } else {
    $('#btn-next-scene').trigger('click');
  }
});

$('#btn-next-scene').on('click', () => {
  // Move to the next scene
  const elementNumber = 0;
  const sceneNumber = parseInt($('#sceneNumber')[0].innerText) + 1;
  const url = buildUrl('showreel', sceneNumber, elementNumber, 'yes');
  window.location.href = url;
});

$('#btn-previous-scene').on('click', () => {
  // Move to the previous scene
  const sceneNumber = parseInt($('#sceneNumber')[0].innerText) - 1;
  const url = buildUrl('showreel', sceneNumber, 0, 'yes');
  window.location.href = url;
});

$('#btn-previous-element').on('click', () => {
  // Move to the previous element
  let sceneNumber = $('#sceneNumber')[0].innerText;
  let elementNumber = parseInt($('#elementNumber')[0].innerText) - 1;
  const url = buildUrl('showreel', sceneNumber, elementNumber, 'yes');
  window.location.href = url;
});


// Update note on focus out
$('#input-note').on('focusout', (e) => {
  const value = e.target.value;
  const sceneNumber = $('#sceneNumber')[0].outerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  let url = buildUrl('update-note', sceneNumber, elementNumber, 'no');
  url = `${url}&val=${value}&caller=showreel`;
  window.location.href = url;
});

// Generate a single sound file
$('.btn-gen').on('click', () => {
  const elementNumber = $('#elementNumber')[0].innerText;
  const sceneNumber = $('#sceneNumber')[0].outerText;
  const voice = $('#voice')[0].innerText;
  let url = buildUrl('generate-single', sceneNumber, elementNumber, 'no');
  url = `${url}&voice=${voice}`;
  $('#message').show();
  window.location.href = url;
});

// Delete a sound file with confirmation
$('.btn-del').on('click', (e) => {
  if (confirm('Are you sure you want to delete this sound file?')) {
    const fileName = e.target.value;
    const sceneNumber = $('#sceneNumber')[0].innerText;
    const elementNumber = $('#elementNumber')[0].innerText;
    let url = buildUrl('delete', sceneNumber, elementNumber, 'no');
    url = `${url}&fileName=${fileName}`;
    window.location.href = url;
  }
});

// Change to the gallery view
$('.btn-change').on('click', () => {
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  let url = buildUrl('gallery', sceneNumber, elementNumber, 'no');
  url = `${url}&caller=showreel`;
  window.location.href = url;
});

$('#btn-show-characters').on('click', () => {
  $('#character-handling').show();
  $('#main').hide();
});

$('#btn-hide-characters').on('click', () => {
  $('#character-handling').hide();
  $('#main').show();
});