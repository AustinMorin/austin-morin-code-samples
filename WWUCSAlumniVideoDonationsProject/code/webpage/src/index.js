// TO COMPILE THE WEBPAGE (node.js MUST be installed)
// 1. cd to alumni-money\code-test\webpage
// 2. Make sure firebase is installed (npm i firebase)
// 3. Run: npm run build
// Then open the html file to make sure everything works as intended
// Clunky, I know. But it works.
/////////////////////////////////////////////////////////////////////////


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  //PRIVATE
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

var name = url_string.substring(url_string.indexOf("?name=") + 6,url_string.length);

/////////////////////////////// IMPORTANT VARIABLE ///////////////////////////////////////////
var fileToView = 'finished_videos/' + name + '.mp4';
/////////////////////////////// IMPORTANT VARIABLE ///////////////////////////////////////////



import { getStorage, ref, getDownloadURL, listAll } from "firebase/storage";

// Create a reference with an initial file path and name
const storage = getStorage();
const pathReference = ref(storage, fileToView);

// Create a reference from a Google Cloud Storage URI
//const gsReference = ref(storage, 'gs://bucket/images/stars.jpg');

// Create a reference from an HTTPS URL
// Note that in the URL, characters are URL escaped!
//const httpsReference = ref(storage, 'https://firebasestorage.googleapis.com/b/bucket/o/images%20stars.jpg');  

console.log("Trying to find: " + fileToView);
getDownloadURL(ref(storage, fileToView))
  .then((url) => {
    // `url` is the download URL for the file
    console.log(url);
    //location.replace(url);
    document.getElementById("video").setAttribute('src',url)
  })
  .catch((error) => {
    // Handle any errors
  });
