// Showreel button click event handler
$('.btn-fff').on('click', (e) => {
  let title = e.target.value;
  // Redirect to showreel with default scene and element numbers
  window.location.href = `/showreel?title=${title}&sceneNumber=0&elementNumber=0`;
});

// FDX conversion button click event handler
$('.btn-fdx').on('click', (e) => {
  let script = e.target.value;
  // Redirect to the conversion page with the specified script
  window.location.href = `/convert?script=${script}`;
});

// FDX overwrite confirmation event handler
$('.btn-fdx-yes').on('click', (e) => {
  if (confirm('Film Fox File already exists. Are you sure you want to overwrite it?')) {
    let script = e.target.value;
    // Redirect to the conversion page with the specified script after confirmation
    window.location.href = `/convert?script=${script}`;
  }
});

$('#btn-api-key').on('click', () => {
  const key = $('#input-api-key').val();
  window.location.href = `/update-api-key?key=${key}`;
});
