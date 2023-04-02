const client = require("./client");

// read book
client.getAll({}, (error, book) => {
  if (!error) {
    console.log('berhasil membaca buku')
    console.log(book)
  } else {
    console.error(error)
  }
})

// add book 
client.addBook(
  {
    id: "3",
    nama: "TereLiye",
    judul: "Hujan",
    rate: 10
  },
  (error, book) => {
    if (!error) {
      console.log('berhasil membuat buku')
      console.log(book)
    } else {
      console.error(error)
    }
  }
)

// edit book 
client.editBook(
  {
    id: "2",
    nama: "Auryn edited",
    nrp: "Turning Page edited",
    nilai: 100
  },
  (error, book) => {
    if (!error) {
      console.log('berhasil mengedit buku')
      console.log(book)
    } else {
      console.error(error)
    }
  }
)

// delete book 
client.deleteBook(
  {
    id: "2"
  }, 
  (error, book) => {
    if (!error) {
      console.log('berhasil menghapus buku')
      console.log(book)
    } else {
      console.error(error)
    }
  }
)