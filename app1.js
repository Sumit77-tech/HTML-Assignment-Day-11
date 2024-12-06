const form = document.getElementById('preferencesForm');
const theme = document.getElementById('theme');
const language = document.getElementById('language');
const notifications = document.getElementById('notifications');

// Function to apply theme dynamically
function applyTheme(themeValue) {
  if (themeValue === 'dark') {
    document.body.classList.add('dark-theme');
  } else {
    document.body.classList.remove('dark-theme');
  }
}

// Function to save preferences to localStorage
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const preferences = {
    theme: theme.value,
    language: language.value,
    notifications: notifications.checked
  };
  
  localStorage.setItem('preferences', JSON.stringify(preferences));

  // Apply the theme immediately
  applyTheme(preferences.theme);

  alert('Preferences Saved!');
});

// Load preferences on page load
window.onload = () => {
  const preferences = localStorage.getItem('preferences');
  if (preferences) {
    const { theme: savedTheme, language: savedLanguage, notifications: savedNotifications } = JSON.parse(preferences);
    
    // Set the form values
    theme.value = savedTheme;
    language.value = savedLanguage;
    notifications.checked = savedNotifications;

    // Apply the theme immediately
    applyTheme(savedTheme);
  }
};

// Optional: Dynamically update theme on theme change
theme.addEventListener('change', () => {
  applyTheme(theme.value);
});
