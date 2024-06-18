$(() => {
  // Set the 'active' class for the navigation item
  $('#nav-characters').addClass('active');
});

$('.btn-edit-character').on('click', (e) => {
  // Handle 'Edit Character' button click
  const character = e.target.value;
  const { title, sceneNumber, elementNumber } = getFilmDetails();
  // Redirect to the edit-character page with relevant details
  window.location.href = `/edit-character?title=${title}&character=${character}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`;
});

$('.btn-add-character').on('click', () => {
  // Handle 'Add Character' button click
  const inputCharacter = $('#input-add-character')[0].value.toUpperCase().trim();
  if (inputCharacter) {
    // If input is valid, get film details and redirect to add-character page
    const { title, sceneNumber, elementNumber } = getFilmDetails();
    window.location.href = `/add-character?title=${title}&character=${inputCharacter}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`;
  }
});

$('.btn-delete-character').on('click', (e) => {
  // Handle 'Delete Character' button click
  const character = e.target.value;
  const { title, sceneNumber, elementNumber } = getFilmDetails();
  // Redirect to delete-character page with relevant details
  window.location.href = `/delete-character?title=${title}&character=${character}&elementNumber=${elementNumber}&sceneNumber=${sceneNumber}`;
});

function getFilmDetails() {
  // Helper function to get film details from the page
  return {
    title: $('#filmTitle')[0].innerText,
    sceneNumber: $('#sceneNumber')[0].innerText,
    elementNumber: $('#elementNumber')[0].innerText,
  };
}
