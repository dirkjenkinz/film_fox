// Function to build a URL based on film details and parameters
const buildUrl = (call, sceneNumber, elementNumber) => {
  const title = $('#filmTitle')[0].innerText;
  if (sceneNumber === '') {
    sceneNumber = $('#sceneNumber')[0].innerText;
  }
  if (elementNumber === '') {
    elementNumber = $('#elementNumber')[0].innerText;
  }
  return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
};

// Click event for selecting an image
$('.btn-select').on('click', (e) => {
  const image = e.target.value;
  const caller = $('#caller')[0].innerText;
  const url = buildUrl('update-image-display', '', '');
  window.location.href = `${url}&image=${image}&caller=${caller}`;
});

// Click event for canceling image selection
$('.btn-cancel').on('click', () => {
  const speak = $('#speak')[0].innerText;
  const url = buildUrl('showreel', '', '');
  window.location.href = `${url}&speak=${speak}`;
});

// Keypress event for searching
$('#search').on('keypress', (e) => {
  const searchString = e.target.value + String.fromCharCode(e.which);
  handleSearch(searchString);
});

// Keydown event for handling backspace in search
$('#search').on('keydown', (e) => {
  if (e.keyCode === 8) {
    let searchString = e.target.value;
    searchString = searchString.substring(0, searchString.length - 1);
    handleSearch(searchString);
  }
});

// Helper function for handling search logic
function handleSearch(searchString) {
  let unusedSize = $('#unused-size')[0].innerText;
  for (let i = 0; i < unusedSize; i++) {
    const ptr = $(`#btn-unused-${i}`)[0].value.indexOf(searchString);
    handleVisibility(ptr, `unused-image-${i}`, `unused-sel-${i}`);
  }

  let usedSize = $('#used-size')[0].innerText;
  for (let i = 0; i < usedSize; i++) {
    const ptr = $(`#btn-used-${i}`)[0].value.indexOf(searchString);
    handleVisibility(ptr, `used-image-${i}`, `used-sel-${i}`);
  }
}

// Helper function for handling visibility based on pointer value
function handleVisibility(ptr, imageId, selId) {
  if (ptr === -1) {
    $(`#${imageId}`).hide();
    $(`#${selId}`).hide();
  } else {
    $(`#${imageId}`).show();
    $(`#${selId}`).show();
  }
}
