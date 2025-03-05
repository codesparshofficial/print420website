// ✅ Firebase Import
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

// ✅ Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBaDy2PoG_-KZVYoraD3tpU_C8CUvKQYQk",
  authDomain: "print420-bbf5b.firebaseapp.com",
  projectId: "print420-bbf5b",
  storageBucket: "print420-bbf5b.firebasestorage.app",
  messagingSenderId: "240976479161",
  appId: "1:240976479161:web:930be6bdf355e041df2c68",
  measurementId: "G-M0LMNP8EYK"
};

// ✅ Firebase Initialize
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app); // ✅ Initialize Storage




// ✅ Start Loader (Common for Login & Checkout Data)



function startLoader() {



if (!document.getElementById("loadingSpinner")) {



const loader = document.createElement("div");



loader.id = "loadingSpinner";



loader.style.position = "fixed";



loader.style.top = "0";



loader.style.left = "0";



loader.style.width = "100vw";



loader.style.height = "100vh";



loader.style.background = "rgba(0, 0, 0, 0.7)";



loader.style.display = "flex";



loader.style.alignItems = "center";



loader.style.justifyContent = "center";



loader.style.zIndex = "9999";







loader.innerHTML = `



  <div style="width: 60px; height: 60px; border: 5px solid white; border-top-color: #FF0000; border-radius: 50%; animation: spin 1s linear infinite;"></div>



  <style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>



`;







document.body.appendChild(loader);



}



}



// ✅ Stop Loader



function stopLoader() {



const loader = document.getElementById("loadingSpinner");



if (loader) {



loader.remove();



}



}



// ✅ Check Authentication + Load Checkout Data with Loader



startLoader(); // ✅ Loader Start before everything



onAuthStateChanged(auth, (user) => {



if (!user) {



alert("⚠ Please login to continue checkout.");



sessionStorage.setItem("redirectAfterLogin", window.location.href);



window.location.href = "login.html";



} else {



document.getElementById("userEmail").textContent = user.email;



document.getElementById("userEmail").style.display = "inline-block";



loadCheckoutData();



}



});



// ✅ Load Order Details from sessionStorage



function loadCheckoutData() {



setTimeout(() => { // ✅ Smooth Transition ke liye Delay



const orderDetails = JSON.parse(sessionStorage.getItem("orderDetails"));







if (!orderDetails) {



  alert("⚠ No order details found! Redirecting to home.");



  window.location.href = "index.html";



  return;



}







document.getElementById("orderName").textContent = orderDetails.name;



document.getElementById("orderPrice").textContent = orderDetails.price;



document.getElementById("orderType").textContent = `Product Type: ${orderDetails.type}`;







document.getElementById("orderImage1").src = orderDetails.image1 || "https://via.placeholder.com/200";



document.getElementById("orderImage2").src = orderDetails.image2 || "https://via.placeholder.com/200";







if (orderDetails.image2) {



  document.getElementById("orderImage2").style.display = "block";



}







document.getElementById("fullName").textContent = orderDetails.fullName;



document.getElementById("address").textContent = orderDetails.address;



document.getElementById("city").textContent = orderDetails.city;



document.getElementById("state").textContent = orderDetails.state;



document.getElementById("pincode").textContent = orderDetails.pincode;



document.getElementById("mobile").textContent = orderDetails.mobile;







stopLoader(); // ✅ Loader Stop jab sab kuch load ho jaye



}, 1000);



}



// ✅ Payment Integration with Razorpay



document.getElementById("placeOrderBtn").addEventListener("click", function() {



const orderDetails = JSON.parse(sessionStorage.getItem("orderDetails"));



const userEmail = auth.currentUser ? auth.currentUser.email : "guest@example.com";



if (!orderDetails) {



alert("❌ Error: Order details missing.");



return;



}



const options = {



key: "rzp_test_NfDhAFYplEhZEf",



amount: parseInt(orderDetails.price.replace("₹", "")) * 100,



currency: "INR",



name: "Print 420",



description: orderDetails.name,



image: "https://codesparshofficial.github.io/Print420/img12.png",



handler: async function(response) {



  if (!response.razorpay_payment_id) {



    alert("❌ Payment failed! Order not placed.");



    return;



  }







  showLoader(); // ✅ Show loader before Firebase save







  const paymentData = {



    paymentId: response.razorpay_payment_id,



    paymentStatus: "Paid",



    orderDetails: orderDetails



  };







  sessionStorage.setItem("paymentDetails", JSON.stringify(paymentData));







  await saveOrderToFirebase({



    ...orderDetails,



    email: userEmail,



    paymentId: response.razorpay_payment_id,



    paymentStatus: "Paid"



  });



},



prefill: {



  name: orderDetails.fullName,



  email: userEmail,



  contact: orderDetails.mobile



},



theme: { color: "#FFB3B3" },



modal: { ondismiss: function() { alert("⚠ Payment was cancelled. Please try again."); } }



};



const rzp1 = new Razorpay(options);



rzp1.open();



});



// ✅ Show Loader Function (100% Working)



function showLoader() {



if (!document.getElementById("loadingSpinner")) {



const loader = document.createElement("div");



loader.id = "loadingSpinner";



loader.style.position = "fixed";



loader.style.top = "0";



loader.style.left = "0";



loader.style.width = "100vw";



loader.style.height = "100vh";



loader.style.background = "rgba(0, 0, 0, 0.7)";



loader.style.display = "flex";



loader.style.alignItems = "center";



loader.style.justifyContent = "center";



loader.style.zIndex = "9999";







loader.innerHTML = `



  <div style="width: 60px; height: 60px; border: 5px solid white; border-top-color: #FF0000; border-radius: 50%; animation: spin 1s linear infinite;"></div>



  <style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>



`;







document.body.appendChild(loader);



console.log("✅ Loader Added");



}



}



// ✅ Hide Loader Function



function hideLoader() {



const loader = document.getElementById("loadingSpinner");



if (loader) {



loader.remove();



console.log("✅ Loader Removed");



}



}




async function saveOrderToFirebase(orderDetails) {
  try {
    startLoader();

    const user = auth.currentUser;
    if (!user) throw new Error("❌ Please log in first");

    console.log("📝 Order saving process started...");

    // ✅ Function to upload images
    async function uploadImageToStorage(imageData, imageName) {
      try {
        if (!imageData) return ""; // Return empty string if no image is provided

        console.log("📤 Image upload started:", imageName);

        let blob = imageData instanceof File ? imageData : await (await fetch(imageData)).blob();
        const storageRef = ref(storage, `orders/${user.uid}/${imageName}`);
        const uploadTask = uploadBytesResumable(storageRef, blob);

        return new Promise((resolve, reject) => {
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log(`⏳ Upload progress: ${progress.toFixed(2)}%`);
            },
            (error) => {
              console.error("❌ Image upload failed:", error);
              reject(""); // Return empty string if upload fails
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              console.log("✅ Image successfully uploaded:", downloadURL);
              resolve(downloadURL);
            }
          );
        });

      } catch (error) {
        console.error("❌ Image upload error:", error.message);
        return ""; // Return empty string on error
      }
    }

    // ✅ First, upload images (Using Promise.all to wait for both uploads)
    const [image1Url, image2Url] = await Promise.all([
      uploadImageToStorage(orderDetails.image1, "design1.jpg"),
      uploadImageToStorage(orderDetails.image2, "design2.jpg"),
    ]);

    // ✅ Now, save order data to Firestore
    const orderData = {
      uid: user.uid,
      address: orderDetails.address,
      city: orderDetails.city,
      email: orderDetails.email,
      fullName: orderDetails.fullName,
      image1: image1Url,  // ✅ Direct image 1 URL
      image2: image2Url,  // ✅ Direct image 2 URL
      mobile: orderDetails.mobile,
      name: orderDetails.name,
      paymentId: orderDetails.paymentId,
      paymentStatus: orderDetails.paymentStatus,
      pincode: orderDetails.pincode,
      price: orderDetails.price,
      state: orderDetails.state,
      type: orderDetails.type,
      createdAt: new Date().toISOString()
    };

    // ✅ Save order to Firestore
    const docRef = await addDoc(collection(db, "orders"), orderData);
    
    console.log("✅ Order successfully saved in Firestore! Order ID:", docRef.id);
    alert("✅ Order placed successfully!");
    window.location.href = "/order-success.html";

  } catch (error) {
    console.error("❌ Error saving order:", error.message);
    alert(`❌ Error: ${error.message}`);
  } finally {
    stopLoader();
  }
}
                             

// ✅ Retrieve Payment Details



function getPaymentDetails() {



const paymentData = JSON.parse(sessionStorage.getItem("paymentDetails"));



if (paymentData) {



console.log("✅ Payment Data Retrieved:", paymentData);



return paymentData;



} else {



console.log("❌ No Payment Data Found.");



return null;



}



}



                   

  
