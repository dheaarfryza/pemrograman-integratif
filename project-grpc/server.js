// Import package 
const grpc = require('@grpc/grpc-js');
const admin = require('firebase-admin');
var protoLoader = require('@grpc/proto-loader');

// Define Proto path 
const PROTO_PATH = './book.proto';

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
}

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

// Load Proto 
const bookProto = grpc.loadPackageDefinition(packageDefinition);

// Initialize Firebase 
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const server = new grpc.Server();

// Dummy data 
let book = {
  book: [
    {
      id: "1",
      nama: "TereLiye",
      judul: "Hujan",
      rate: 10
    },
    {
      id: "2",
      nama: "Auryn",
      judul: "Turning Page",
      rate: 9.5
    }
  ]
}

// Add service in proto 
server.addService(bookProto.BookService.service, {
  // Create
  addBook: (call, callback) =>  {
    const _book = { ...call.request };
    db.collection('books').add(_book)
      .then(docRef => {
        _book.id = docRef.id;
        callback(null, _book);
      })
      .catch(err => {
        console.error(err);
        callback(err);
      });
  },
  // Read 
  getAll: (call, callback) => {
    db.collection('books').get()
      .then(snapshot => {
        let books = [];
        snapshot.forEach(doc => {
          books.push(doc.data());
        });
        callback(null, { book: books });
      })
      .catch(err => {
        console.error(err);
        callback(err);
      });
  },
  getBook: (call, callback) => {
    const bookId = call.request.id;
    db.collection('books').doc(bookId).get()
      .then(doc => {
        if (!doc.exists) {
          callback({ code: grpc.status.NOT_FOUND, details: "Book not found" });
        } else {
          callback(null, doc.data());
        }
      })
      .catch(err => {
        console.error(err);
        callback(err);
      });
  },
  // Update
  editBook: (call, callback) => {
    const bookId = call.request.id;
    const bookRef = db.collection('books').doc(bookId);
    bookRef.update(call.request)
      .then(() => {
        bookRef.get()
          .then(doc => {
            callback(null, doc.data());
          })
          .catch(err => {
            console.error(err);
            callback(err);
          });
      })
      .catch(err => {
        console.error(err);
        callback(err);
      });
  },
  // Delete 
  deleteBook: (call, callback) => {
    const bookId = call.request.id;
    db.collection('books').doc(bookId).delete()
      .then(() => {
        callback(null, {});
      })
      .catch(err => {
        console.error(err);
        callback(err);
      });
  },
});

// Start server 
server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);