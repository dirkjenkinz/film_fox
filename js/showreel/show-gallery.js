$(() => {
  // Add 'active' class to the navigation link for the show gallery
  $('#nav-show-gallery').addClass('active');
});

// Function to build URLs with film details
const buildUrl = (call, sceneNumber, elementNumber) => {
  const title = $('#filmTitle')[0].innerText;
  // If sceneNumber or elementNumber are not provided, get them from the respective elements
  if (sceneNumber === '') {
    sceneNumber = $('#sceneNumber')[0].innerText;
  }
  if (elementNumber === '') {
    elementNumber = $('#elementNumber')[0].innerText;
  }
  // Construct the URL
  return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
};

// Event listener for delete button click
$('.btn-delete').on('click', (e) => {
  // Confirm deletion with the user
  if (confirm('Are you sure you want to delete this image?')) {
    const image = e.target.value;
    // Build the URL and navigate to it
    const url = buildUrl('delete-image', '', '');
    window.location.href = `${url}&image=${image}`;
  }
});
  
// Event listener for rename button click
$('.btn-rename').on('click', (e) => {
  // Get values for renaming
  const from = e.target.value.trim();
  const id = e.target.id.substring(11);
  const to = $(`#input-rename-${id}`)[0].value.trim();
  // Build the URL and navigate to it
  const url = buildUrl('rename-image', '', '');
  window.location.href = `${url}&from=${from}&to=${to}`;
});
