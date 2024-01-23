const newPasswordInput = document.getElementById('newPassword');
const repeatPasswordInput = document.getElementById('repeatPassword');
const submitButton = document.getElementById('submitButton');
const passwordStrength = document.getElementById('passwordStrength');
const strengthIndicator = document.getElementById('strengthIndicator');

newPasswordInput.addEventListener('input', checkPassword);
repeatPasswordInput.addEventListener('input', checkPassword);

function updatePlaceHolder(input) {

  var usernameInput = document.getElementById(input);
  var placeholderParagraph = document.getElementById(input+'placeholder');
  var hideshow = document.querySelector("#hideShow"+input)

try {
  hideshow.classList.add('hideShowFucused');
  placeholderParagraph.classList.add('placeholderWithText');

  document.getElementById(input).addEventListener('blur', function() {
      placeholderParagraph.classList.remove('placeholderWithText');
      hideshow.classList.remove('hideShowFucused');
      if (usernameInput.value !== "") {
        placeholderParagraph.classList.add('placeholderWithText');
        hideshow.classList.add('hideShowFucused');
      } else {
        placeholderParagraph.classList.remove('placeholderWithText');
        hideshow.classList.remove('hideShowFucused');
      }
 
    });

  } catch (error) {
  placeholderParagraph.classList.add('placeholderWithText');

  document.getElementById(input).addEventListener('blur', function() {
      placeholderParagraph.classList.remove('placeholderWithText');
      if (usernameInput.value !== "") {
        placeholderParagraph.classList.add('placeholderWithText');
      } else {
        placeholderParagraph.classList.remove('placeholderWithText');
      }
 
    });

  }
}




// Runs on page load 
checkPassword()
function checkPassword() {
const newPassword = newPasswordInput.value;
  const repeatPassword = repeatPasswordInput.value;

  const strength = calculatePasswordStrength(newPassword);

  updateStrengthIndicator(strength);

  


  if ((strength == 'strong') && newPassword == repeatPassword)  {
    submitButton.removeAttribute('disabled');
    submitButton.classList.add('buttonChangeEnabled');
    return true;
  } else {
    submitButton.setAttribute('disabled', 'disabled');
    submitButton.classList.remove('buttonChangeEnabled');
    return false;
  }


  
}

function calculatePasswordStrength(password) {

  const newPassword = newPasswordInput.value;
  const repeatPassword = repeatPasswordInput.value;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  SixChar = document.getElementById("6Char")
  caseChar = document.getElementById("caseChar")
  spesChar = document.getElementById("spesChar")
  stronkChar = document.getElementById("stronkChar")

  SixChar.classList.toggle("checked-li", password.length >= 6);
  caseChar.classList.toggle("checked-li", hasUppercase && hasLowercase);
  spesChar.classList.toggle("checked-li", hasSpecialChar || hasNumber);
  stronkChar.classList.toggle("checked-li", hasUppercase && hasLowercase && hasSpecialChar && password.length >= 6 || hasUppercase && hasLowercase && hasNumber && password.length >= 6 || hasUppercase && hasLowercase && hasNumber && hasSpecialChar && password.length >= 6);
  strengthLabel = document.querySelector("#StrenghtLabel")

  if ((newPassword && repeatPassword) && newPassword != repeatPassword) {
    toast('Both password feelds must match!')
    document.getElementById("submitButton").disabled = "disabled"
  }
  else if ((newPassword && repeatPassword) && newPassword == repeatPassword) {
    document.getElementById("submitButton").disabled = ""
    toastContainer = document.getElementById("toast")
    toastContainer.remove()
  }

  if (hasUppercase && hasLowercase && hasSpecialChar && password.length >= 6 || hasUppercase && hasLowercase && hasNumber && password.length >= 6 || hasUppercase && hasLowercase && hasNumber && hasSpecialChar && password.length >= 6) {
strengthLabel.innerHTML = "Excellent"
    return 'strong';
  }
  else if (hasUppercase && hasLowercase) {
    strengthLabel.innerHTML = "Moderate"
    return 'medium';
  }
  else {
strengthLabel.innerHTML = "Weak"
    return 'weak';
  }
}

function updateStrengthIndicator(strength) {
  strengthIndicator.className = '';
  strengthIndicator.classList.add(strength);
}

// Toggle password visability

var isPasswordVisible = false;

function togglePassword(input) {
var hideshow = document.querySelector("#hideShow"+input)
  var passwordInput = document.getElementById(input);
    
  isPasswordVisible = !isPasswordVisible;

  if (isPasswordVisible) {
    passwordInput.type = 'text';
    hideshow.innerHTML = "Hide"
    hideshow.classList.add('hideShowUnder')
  } else {
    passwordInput.type = 'password';
    hideshow.innerHTML = "Show"
    hideshow.classList.remove('hideShowUnder')
  }
}

function toast(message) {

//Removes existing toast if found
try {
  toastContainer = document.getElementById("toast")
  toastContainer.remove()
} catch (error) {}

// Fill in with relevant information
// Or change if needed
  if(!message){
    message = "NULL"
  }

  var toastContainer = document.createElement('div');
  toastContainer.className = 'toast';
  toastContainer.id = 'toast';

  var toastMessage = document.createElement('div');
  toastMessage.className = 'toastMessage';
  toastMessage.textContent = message;

  toastContainer.appendChild(toastMessage);

  var formContainer = document.getElementById('formContainer');
  formContainer.appendChild(toastContainer);
}

// Adjusts label width to match input width for mobile devices
window.addEventListener('DOMContentLoaded', (event) => {
  const setLabelContainerWidth = (inputId) => {
      const inputElement = document.querySelector(`#${inputId}`);
      const labelContainer = inputElement.nextElementSibling;

      const widthWithDecimals = Math.ceil(inputElement.getBoundingClientRect().width * 100) / 100;

      const adjustedWidth = widthWithDecimals - 20;

      labelContainer.style.setProperty('width', `${adjustedWidth}px`, 'important');
  };

  const resetLabelContainerWidth = (inputId) => {
      const labelContainer = document.querySelector(`#${inputId}`).nextElementSibling;
      labelContainer.style.removeProperty('width');
  };
  const checkAndSetWidthForInputs = () => {
      const inputIds = ["username", "oldPassword", "newPassword", "repeatPassword"];

      inputIds.forEach((inputId) => {
          if (window.innerWidth < 650) {
              setLabelContainerWidth(inputId);
          } else {
              resetLabelContainerWidth(inputId);
          }
      });
  };
  checkAndSetWidthForInputs();

  window.addEventListener('resize', () => {
      checkAndSetWidthForInputs();
  });
});

// Adjusts spacing for password input on mobile devices
function updateClassBasedOnWidth() {
  var windowWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  var targetElement = document.querySelector("#formComposer > div.passwordContainer > div:nth-child(1)"); 
  if (windowWidth < 650) {
    targetElement.classList.add("inputContainerSpacing");
  } else {
    targetElement.classList.remove("inputContainerSpacing");
  }
}

// Runs on page load
updateClassBasedOnWidth();
// Runs on every window resize
window.addEventListener("resize", updateClassBasedOnWidth);
