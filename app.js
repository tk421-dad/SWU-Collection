const SUPABASE_URL = "https://wpcbssufivtzoeplcluw.supabase.co";
const SUPABASE_KEY = "sb_publishable_3SU-rHXNXxqRSMkGLbId3Q_DpOjW7_i";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

const authForm = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const signupButton = document.getElementById("signup-button");
const authMessage = document.getElementById("auth-message");
const authSection = document.getElementById("auth-section");
const userSection = document.getElementById("user-section");
const userEmail = document.getElementById("user-email");
const signoutButton = document.getElementById("signout-button");
function showAuthMessage(message, type) {
  authMessage.textContent = message;
  authMessage.className =
    type === "success" ? "auth-success" : "auth-error";
}

async function testSupabaseConnection() {
  const statusElement = document.getElementById("connection-status");

  try {
    const { error } = await supabaseClient.auth.getSession();

    if (error) {
      throw error;
    }

    statusElement.textContent = "Database connected";
    statusElement.className = "connection-success";
  } catch (error) {
    statusElement.textContent = "Database connection failed";
    statusElement.className = "connection-error";

    console.error("Supabase connection error:", error.message);
  }
}

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

  showAuthMessage(
    `Signed in successfully as ${data.user.email}`,
    "success"
  );

  passwordInput.value = "";
}

async function createUser(email, password) {
  showAuthMessage("Creating account...", "success");

  const { data, error } = await supabaseClient.auth.signUp({
    email: email,
    password: password
  });

  if (error) {
    showAuthMessage(error.message, "error");
    return;
  }

  if (data.session) {
    showAuthMessage(
      `Account created and signed in as ${data.user.email}`,
      "success"
    );
  } else {
    showAuthMessage(
      "Account created. Check your email and confirm your account before signing in.",
      "success"
    );
  }

  passwordInput.value = "";
}

authForm.addEventListener("submit", async function(event) {
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
});

signupButton.addEventListener("click", async function() {
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
  await createUser(email, password);
});

testSupabaseConnection();
checkCurrentSession();

signoutButton.addEventListener("click", async function() {
  signoutButton.disabled = true;
  signoutButton.textContent = "Signing Out...";

  const { error } = await supabaseClient.auth.signOut();

  signoutButton.disabled = false;
  signoutButton.textContent = "Sign Out";

  if (error) {
    alert(`Unable to sign out: ${error.message}`);
  }
});
async function checkCurrentSession() {
  const {
    data: { session },
    error
  } = await supabaseClient.auth.getSession();

  if (error) {
    console.error("Unable to read session:", error.message);
    updateAccountDisplay(null);
    return;
  }

  updateAccountDisplay(session);
}

supabaseClient.auth.onAuthStateChange(function(event, session) {
  updateAccountDisplay(session);

  if (event === "SIGNED_IN") {
    console.log("User signed in.");
  }

  if (event === "SIGNED_OUT") {
    console.log("User signed out.");
  }
});
