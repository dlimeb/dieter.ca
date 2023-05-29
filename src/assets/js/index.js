import '../scss/index.scss';

var modes = ['light', 'dark'];

// set initial theme based on user's current preference
var currentMode = modes[0];

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
  currentMode = modes[1];
}

document.body.setAttribute('data-theme', currentMode);
var newMode = currentMode === modes[0] ? modes[1] : modes[0];
document.getElementById('theme-switcher').setAttribute('aria-label', 'Activate ' + newMode + ' mode');


// attach listener to switcher button to invert mode on click
document.getElementById('theme-switcher').addEventListener('click', function(event){
  var currentMode = document.body.getAttribute('data-theme') === modes[0] ? modes[0] : modes[1],
      newMode = currentMode === modes[0] ? modes[1] : modes[0];

  document.body.setAttribute('data-theme', newMode);
  document.getElementById('theme-switcher').setAttribute('aria-label', 'Activate ' + currentMode + ' mode');
});