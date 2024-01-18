const newPasswordInput = document.getElementById('newPassword');
const repeatPasswordInput = document.getElementById('repeatPassword');
const submitButton = document.getElementById('submitButton');
const passwordStrength = document.getElementById('passwordStrength');
const strengthIndicator = document.getElementById('strengthIndicator');

const allowedSymbols = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-={}[]\|:;"<>,.?/'

newPasswordInput.addEventListener('input', checkPassword);
repeatPasswordInput.addEventListener('input', checkPassword);

function checkPassword() {
  const newPassword = newPasswordInput.value;
  const repeatPassword = repeatPasswordInput.value;

  const strength = calculatePasswordStrength(newPassword);

  updateStrengthIndicator(strength);

  if ((strength == 'strong' || strength == 'high') && newPassword == repeatPassword)  {
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

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  // if (!allowedSymbols.test(password)) {
  //   return 'One or more symbol in password is not allowed!'
  // }
  if (hasUppercase && hasLowercase && hasNumber && hasSpecialChar && password.length >= 6) {
    return 'strong'; 
  }
  else if (hasUppercase && hasLowercase && hasNumber){
    return 'high';
  } 
  else if (hasUppercase && hasLowercase){
    return 'medium';
  }
  else {
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
  var passwordInput = document.getElementById(input);
  var showPasswordIcon = document.getElementById(input + 'showPassword');
  
  isPasswordVisible = !isPasswordVisible;

  if (isPasswordVisible) {
    passwordInput.type = 'text';
    showPasswordIcon.classList.remove('fa-eye');
    showPasswordIcon.classList.add('fa-eye-slash');
  } else {
    passwordInput.type = 'password';
    showPasswordIcon.classList.remove('fa-eye-slash');
    showPasswordIcon.classList.add('fa-eye');
  }
}