// Set 'Edit Scene' as the active navigation tab
$(() => {
  $('#nav-edit-scene').addClass('active');
});

// Event handler for changing scene details
$('#btn-change').on('click', (e) => {
  const element = e.target.value;
  const title = $('#filmTitle')[0].innerText;
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const note = $('#note')[0].value; // Get the value of the note input

  // Redirect to the gallery page with updated scene details
  window.location.href = `/gallery?title=${title}&element=${element}&sceneNumber=${sceneNumber}&note=${note}&caller=edit-scene`;
});
