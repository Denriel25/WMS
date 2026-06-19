const API = "http://localhost:5000/api/books";

async function loadBooks(){
const res = await fetch(API);
const data = await res.json();

let list = document.getElementById("bookList");
list.innerHTML = "";

data.forEach((b,i)=>{
list.innerHTML += `
<tr>
<td>${b.title}</td>
<td>${b.author}</td>
<td><button onclick="deleteBook(${i})">Delete</button></td>
</tr>`;
});
}

async function addBook(){
let title = document.getElementById("title").value;
let author = document.getElementById("author").value;

await fetch(API,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({title,author})
});

loadBooks();
}

async function deleteBook(id){
await fetch(`${API}/${id}`,{method:"DELETE"});
loadBooks();
}

loadBooks();