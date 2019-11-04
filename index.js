const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const passport = require('passport');
const usersRoutes = require('./routes/users');
const teamsRoutes = require('./routes/teams');
const notesRoutes = require('./routes/notes');


// Access .env variables with dotenv config:
require('dotenv').config(); 

// Import MongoDB URI from configVars in dbConfig folder:
const db = process.env.MONGO_DB_URI;

// Connect to Mongo DB:
mongoose
    .connect(
        db,
        { useNewUrlParser: true }
    )
    .then(() => console.log('Database successfully connected'))
    .catch(error => console.log(error));

// Firebase imports:
const firebase = require("firebase/app");
require("firebase/auth");
require("firebase/database");
const firebaseAdmin = require('firebase-admin');    

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
     projectId: process.env.FIREBASE_PROJECT_ID,
     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
     privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FIREBASE_DB_URL
});

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.FIREBASE_DB_URL,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,	
};

firebase.initializeApp(firebaseConfig);    

// Create Express server
const server = express();

server.use(express.json());
server.use(cors());

// Test endpoint:
server.get('/',(req, res) => {
  res.send("*Server base URL requested*");
});

// Verify requests using Firebase-admin authentication:
server.use(async (req,res) => {
  console.log('server auth hit with req.body: ', req.body);
  const idToken = req.headers.authorization; 
  console.log(idToken); 
  try {
      await firebaseAdmin.auth().verifyIdToken(idToken)       // verify the idToken of the incoming req
        .then(decodedToken => {                       // get the decoded token back from Firebase
          req.body.uid = decodedToken.uid;            // add the uid from the decoded token to req.body
          return req.next();                          // move to the next part of the original req
        });
    }
    catch(error) {
      res.status(401).json({message: error.message});
    }
})

// Tie API routes to the relevant file with those endpoints.
// Requests to these routes will first go throuth the auth middleware above:
server.use('/api/users', usersRoutes);
server.use('/api/teams', teamsRoutes);
server.use('/api/notes', notesRoutes);

// Define the port where the server will run:
const port = process.env.PORT || 5000; 

// Initialize server listening:
server.listen(port, () => console.log(`Server is running on port ${port}`));


// *** Old code
// Import API route/endpoint files:

// const app = express();

// app.use(cors());

// // Bodyparser middleware:
// app.use(
//   bodyParser.urlencoded({
//     extended: false
//   })
// );
// app.use(bodyParser.json());

// // Import MongoDB URI from configVars in dbConfig folder:
// const db = require('./config/configVars').mongoURI;

// // Connect to Mongo DB:
// mongoose
//     .connect(
//         db,
//         { useNewUrlParser: true }
//     )
//     .then(() => console.log('Database successfully connected'))
//     .catch(error => console.log(error));

// // Initialize passport and bind to the express server app:
// app.use(passport.initialize());

// // Import passport config and apply to passport:
// require('./config/passport')(passport);

// // Define routes and bind to the express server app:
// app.use('/api/users', usersRoutes);

// // Define the port where the server will run:
// const port = process.env.PORT || 5000; 

// // Initialize server listening:
// app.listen(port, () => console.log(`Server is running on port ${port}`));