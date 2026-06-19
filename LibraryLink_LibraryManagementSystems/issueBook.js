async function issueBook(){

 const { error } =
 await supabase
 .from('issued_books')
 .insert([{
      student_email:
      "student@gmail.com",

      book_id:1,

      issue_date:
      new Date(),

      due_date:
      new Date(
      Date.now() +
      14*24*60*60*1000)
 }]);

 if(!error){
   alert("Book Issued");
 }
}