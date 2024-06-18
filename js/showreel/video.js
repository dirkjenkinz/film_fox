// Wait for the document to be ready before executing the code
$(document).ready(() => {
  try {
    var videoScrollPos = localStorage.getItem('videoScrollPosition');
    if (videoScrollPos) {
      $(window).scrollTop(videoScrollPos);
    }

    // Set the 'active' class for the 'nav-video' element
    $('#nav-video').addClass('active');

    // Function to generate elements based on film title and scene number
    const generateElements = (sceneNumber) => {
      try {
        const title = $('#filmTitle')[0].innerText;
        // Redirect to the create-video page with parameters
        window.location.href = `/create-video?title=${encodeURIComponent(title)}&sceneNumber=${encodeURIComponent(sceneNumber)}`;
      } catch (error) {
        console.error('Error generating elements:', error);
      }
    };

    // Event handler for 'btn-generate-elements' click
    $('.btn-generate-elements').on('click', (e) => {
      try {
        generateElements($(e.target).val()); // Use jQuery to get the value of the clicked button
      } catch (error) {
        console.error('Error handling btn-generate-elements click:', error);
      }
    });

    // Event handler for 'btn-generate-scene' click
    $('.btn-generate-scene').on('click', (e) => {
      try {
        generateElements($(e.target).val()); // Use jQuery to get the value of the clicked button
      } catch (error) {
        console.error('Error handling btn-generate-scene click:', error);
      }
    });

    // Event handler for 'btn-generate-all' click
    $('#btn-generate-all').on('click', () => {
      try {
        const title = $('#filmTitle')[0].innerText;
        // Redirect to generate-scene page with 'all' as the scene number
        window.location.href = `/generate-scene?title=${encodeURIComponent(title)}&sceneNumber=all`;
      } catch (error) {
        console.error('Error handling btn-generate-all click:', error);
      }
    });

    // Event handler for 'btn-generate-all' click
    $('#btn-create-master').on('click', () => {
      try {
        const title = $('#filmTitle')[0].innerText;
        window.location.href = `/create-master?title=${encodeURIComponent(title)}`;
      } catch (error) {
        console.error('Error handling btn-create-master click:', error);
      }
    });

  } catch (error) {
    console.error('Error executing document ready function:', error);
  }
  // Save scroll position to localStorage when user is about to leave the page
  window.onbeforeunload = function () {
    localStorage.setItem('videoScrollPosition', window.scrollY);
  };

});
