const SUPABASE_URL =
  "https://wpcbssufivtzoeplcluw.supabase.co";

const SUPABASE_KEY =
  "sb_publishable_3SU-rHXNXxqRSMkGLbId3Q_DpOjW7_i";

const supabaseClient = supabase.createClient(
  SUPABASE_URL,
  SUPABASE_KEY
);

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

testSupabaseConnection();