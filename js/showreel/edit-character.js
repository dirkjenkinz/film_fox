// Event handler for playing sound
$('.btn-play').on('click', (e) => {
  const title = $('#filmTitle')[0].innerText;
  const element = e.target.value; // Declare 'element' using 'const' for consistency
  const soundPath = `../data/${title}/sound/sounds/${element}`;
  
  // Set the source and play the audio
  document.getElementById('master-play').setAttribute('src', soundPath);
  document.getElementById('master-play').play();
});

// Event handler for returning to characters page
$('.btn-return').on('click', (e) => {
  const title = $('#filmTitle')[0].innerText;
  const sceneNumber = $('#sceneNumber')[0].innerText;
  const elementNumber = $('#elementNumber')[0].innerText;
  
  // Redirect to the characters page with film details
  window.location.href = `/characters?title=${title}&sceneNumber=${sceneNumber}&elementNumber=${elementNumber}`;
});

// Event handler for generating a single character
$('.btn-gen').on('click', (e) => {
  const file = e.target.value.split('_');
  const title = $('#filmTitle')[0].innerText;
  const voice = $('#current-voice')[0].innerText;
  const character = $('#character')[0].innerText;
  
  // Redirect to generate-single page with film details and character information
  window.location.href = `/generate-single?title=${title}&sceneNumber=${file[0]}&elementNumber=${file[1]}&voice=${voice}&caller=edit-character&character=${character}`;
});
