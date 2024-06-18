// Wait for the document to be ready before executing the code
$(document).ready(() => {
  try {
    // Set the 'active' class for the 'nav-voices' element
    $('#nav-voices').addClass('active');
  } catch (error) {
    console.error('Error setting active class for nav-voices:', error);
  }
});

// Event handler for 'Get Sample' button click
$('.btn-get-sample').on('click', (e) => {
  try {
    // Redirect to get-samples page with parameters
    window.location.href = `/get-samples?voice_id=${encodeURIComponent(e.target.value)}`;
  } catch (error) {
    console.error('Error handling btn-get-sample click:', error);
  }
});

// Event handler for 'Play Sample' button click
$('.btn-play-sample').on('click', (e) => {
  try {
    const element = e.target.value + '.mp3';
    const audioSource = '../data/samples/' + element;
    // Set audio source and play the audio
    $('#master-play').attr('src', audioSource); // Use jQuery attr() method to set attribute
    $('#master-play').get(0).play(); // Use get(0) to access DOM element and play() to play the audio
  } catch (error) {
    console.error('Error handling btn-play-sample click:', error);
  }
});
