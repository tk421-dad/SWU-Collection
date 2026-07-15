const SUPABASE_URL = "https://wpcbssufivtzoeplcluw.supabase.co";
const SUPABASE_KEY = "sb_publishable_3SU-rHXNXxqRSMkGLbId3Q_DpOjW7_i";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

// Page elements
const authForm = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupButton = document.getElementById("signup-button");
const authMessage = document.getElementById("auth-message");

const authSection = document.getElementById("auth-section");
const userSection = document.getElementById("user-section");
const userEmail = document.getElementById("user-email");
const signoutButton = document.getElementById("signout-button");

// Display a login or account message
function showAuthMessage(message, type) {
  authMessage.textContent = message;

  if (type === "success") {
    authMessage.className = "auth-success";
  } else {
    authMessage.className = "auth-error";
  }
}

// Show the correct section based on login status
function updateAccountDisplay(session) {
  if (session && session.user) {
    authSection.hidden = true;
    userSection.hidden = false;
    userEmail.textContent = session.user.email;
  } else {
    authSection.hidden = false;
    userSection.hidden = true;
    userEmail.textContent = "";
  }
}

// Test the Supabase connection
async function testSupabaseConnection() {
  const statusElement = document.getElementById(
    "connection-status"
  );

  try {
    const { error } =
      await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    statusElement.textContent = "Database connected";
    statusElement.className = "connection-success";
  } catch (error) {
    statusElement.textContent =
      "Database connection failed";

    statusElement.className = "connection-error";

    console.error(
      "Supabase connection error:",
      error.message
    );
  }
}

// Sign in
async function signInUser(email, password) {
  showAuthMessage("Signing in...", "success");

  const { data, error } =
    await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password
    });

  if (error) {
    showAuthMessage(error.message, "error");
    return;
  }

  updateAccountDisplay(data.session);
  passwordInput.value = "";
}

// Create an account
async function createUser(email, password) {
  showAuthMessage("Creating account...", "success");

  const { data, error } =
    await supabaseClient.auth.signUp({
      email: email,
      password: password
    });

  if (error) {
    showAuthMessage(error.message, "error");
    return;
  }

  if (data.session) {
    updateAccountDisplay(data.session);
  } else {
    showAuthMessage(
      "Account created. Check your email and confirm your account before signing in.",
      "success"
    );
  }

  passwordInput.value = "";
}

// Login form
authForm.addEventListener(
  "submit",
  async function(event) {
    event.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showAuthMessage(
        "Enter your email address and password.",
        "error"
      );
      return;
    }

    await signInUser(email, password);
  }
);

// Create Account button
signupButton.addEventListener(
  "click",
  async function() {
    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
      showAuthMessage(
        "Enter your email address and password first.",
        "error"
      );
      return;
    }

    if (password.length < 6) {
      showAuthMessage(
        "Your password must be at least 6 characters long.",
        "error"
      );
      return;
    }

    await createUser(email, password);
  }
);

// Sign Out button
signoutButton.addEventListener(
  "click",
  async function() {
    signoutButton.disabled = true;
    signoutButton.textContent = "Signing Out...";

    const { error } =
      await supabaseClient.auth.signOut();

    signoutButton.disabled = false;
    signoutButton.textContent = "Sign Out";

    if (error) {
      alert(
        `Unable to sign out: ${error.message}`
      );
      return;
    }

    updateAccountDisplay(null);
  }
);

// Check for an existing login
async function checkCurrentSession() {
  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

  if (error) {
    console.error(
      "Unable to read session:",
      error.message
    );

    updateAccountDisplay(null);
    return;
  }

  updateAccountDisplay(session);
}

// Watch for login and logout changes
supabaseClient.auth.onAuthStateChange(
  function(event, session) {
    updateAccountDisplay(session);

    console.log("Authentication event:", event);
  }
);

// Start the app
testSupabaseConnection();
checkCurrentSession();
