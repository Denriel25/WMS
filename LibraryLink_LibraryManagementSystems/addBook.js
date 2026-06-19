async function addBook(){

 const { error } =
 await supabase
 .from('books')
 .insert([
 {
   title:"Database Systems",
   author:"Elmasri",
   category:"IT",
   isbn:"123456",
   quantity:10,
   available:10
 }
 ]);

 if(!error){
    alert("Book Added");
 }
}