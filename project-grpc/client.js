// Import package 
const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

// Define proto path 
const PROTO_PATH = "./book.proto"

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

// Load service 
const BookService = grpc.loadPackageDefinition(packageDefinition).BookService;

// Define client 
const client = new BookService(
  "127.0.0.1:50051",
  grpc.credentials.createInsecure()
)

async function main() {
    const books = await listBooks();
    console.log('List all books:', books);
  
    const book1 = await insertBook({ id: '1', nama: 'Book 1', judul: 'judul 1', rate: 9 });
    console.log('Insert book 1:', book1);
  
    const book2 = await insertBook({ id: '2', nama: 'Book 2', judul: 'judul 2', rate: 8.5 });
    console.log('Insert book 2:', book2);
  
    const book3 = await getBook('1');
    console.log('Get book 1:', book3);
  
    const book4 = await updateBook({ id: '1', nama: 'Book 1 (updated)', judul: 'judul 1 (updated)', rate: 10 });
    console.log('Update book 1:', book4);
  
    const book5 = await deleteBook('2');
    console.log('Delete book 2:', book5);
  
    const books2 = await listBooks();
    console.log('List all books:', books2);
  }
  
  async function listBooks() {
    return new Promise((resolve, reject) => {
      client.list({}, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response.books);
        }
      });
    });
  }
  
  async function getBook(id) {
    return new Promise((resolve, reject) => {
      client.get({ id }, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
  
  async function insertBook(book) {
    return new Promise((resolve, reject) => {
      client.insert(book, (err, response) => {
        if (err) {
          reject(err);
        } else {
          resolve(response);
        }
      });
    });
  }
  
  async function updateBook(book) {
    return new Promise((resolve, reject) => {
      client.update(book, (err, response) => {
        if (err) {
          reject(err)
        } else {
            resolve(response);
          }
        });
    });
}

async function deleteBook(id) {
return new Promise((resolve, reject) => {
client.delete({ id }, (err, response) => {
if (err) {
reject(err);
} else {
resolve(response);
}
});
});
}

main().catch(console.error);
module.exports = client;