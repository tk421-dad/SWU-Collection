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

  await createUser(email, password);
});

testSupabaseConnection();
