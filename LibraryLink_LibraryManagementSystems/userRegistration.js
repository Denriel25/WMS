async function signup() {

  const email =
  document.getElementById("email").value;

  const password =
  document.getElementById("password").value;

  const { error } =
  await supabase.auth.signUp({
      email,
      password
  });

  if(error){
      alert(error.message);
  }else{
      alert("Account Created");
  }
}