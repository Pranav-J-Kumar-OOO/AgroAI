import admin from 'firebase-admin';

var id = "9944312005";

// Initialize Firebase Admin SDK with your service account credentials
admin.initializeApp({
  credential: admin.credential.cert('database-key.json'),
  databaseURL: 'https://agroai-7572f-default-rtdb.asia-southeast1.firebasedatabase.app',
});

// Get a reference to your database
const db = admin.database();

// Example: Writing data to the database
db.ref(id).set('Hellso, Firebase!');

// Example: Reading data from the database
db.ref('test').once('value', (snapshot) => {

  process.exit();
});
