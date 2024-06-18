$(() => {
  var sceneArrangerScrollPos = localStorage.getItem('sceneArrangerScrollPosition');
  if (sceneArrangerScrollPos) {
    $(window).scrollTop(sceneArrangerScrollPos);
  }
  // Add 'active' class to the navigation link for scene arranger
  $('#nav-arranger').addClass('active');
});

$('#btn-reset').on('click', (e) => {
  // Ask for confirmation before resetting the scene order
  if (confirm('Are you sure you want to reset the scene order?')) {
    const title = $('#filmTitle')[0].innerText;
    // Redirect to change-scene-order route with reset flag
    window.location.href = `/change-scene-order?title=${title}&reset=yes`;
  }
});

function allowDrop(event) {
  event.preventDefault(); // This is necessary to allow dropping.
}

function drag(event) {
  event.dataTransfer.setData('text', event.target.id); // Set the ID of the dragged element.
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData('text');
  var draggedElement = document.getElementById(data);
  var target = event.target.closest('.scene-box'); // Ensures dropping on a scene box only.

  if (target && target !== draggedElement) {
    var parent = target.parentNode;
    parent.insertBefore(draggedElement, target); // Insert before the target element.
    updateSceneOrder(draggedElement, target); // This function would update the order persistently if needed.
  }
}

function updateSceneOrder(from, to) {
  from = from.id.substring(3);
  to = to.id.substring(3);
  const title = $('#filmTitle')[0].innerText;
  window.location.href = `/change-scene-order?title=${title}&from=${from}&to=${to}&reset=no`;
}
  // Save scroll position to localStorage when user is about to leave the page
  window.onbeforeunload = function () {
    localStorage.setItem('sceneArrangerScrollPosition', window.scrollY);
  };