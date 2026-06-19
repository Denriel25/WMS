const file =
document.getElementById("cover").files[0];

await supabase.storage
.from('book-covers')
.upload(
 `covers/${Date.now()}_${file.name}`,
 file
);