$(() => {
  // Set the 'active' class for the navigation item
  $('#nav-credits').addClass('active');
});

const buildUrl = (call, sceneNumber, elementNumber) => {
  // Helper function to build URLs with film details
  const title = $('#filmTitle')[0].innerText;
  if (sceneNumber === '') {
    sceneNumber = $('#sceneNumber')[0].innerText;
  }
  if (elementNumber === '') {
    elementNumber = $('#elementNumber')[0].innerText;
  }
  return `/${call}?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
};

// Handle focusout event for input fields
const handleFocusOut = (credit) => (e) => {
  const val = e.target.value;
  const url = buildUrl('update-credits', '', '');
  // Redirect to update-credits page with the credit and value
  window.location.href = `${url}&credit=${credit}&val=${val}`;
};

// Assign event handlers for each input field
$('#input-writer').on('focusout', handleFocusOut('writer'));
$('#input-director').on('focusout', handleFocusOut('director'));
$('#input-producer').on('focusout', handleFocusOut('producer'));
$('#input-title').on('focusout', handleFocusOut('title'));
