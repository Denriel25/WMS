async function loadBooks(){

 const { data,error } =
 await supabase
 .from('books')
 .select('*');

 console.log(data);
}