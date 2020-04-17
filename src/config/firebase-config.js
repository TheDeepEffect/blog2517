import firebase from "firebase";

const firebaseConfig = {
	apiKey: "AIzaSyDLtx6o2D3SnYgV0tgNasUap2Fj_HvKCvk",
	authDomain: "blog2517-5a269.firebaseapp.com",
	databaseURL: "https://blog2517-5a269.firebaseio.com",
	projectId: "blog2517-5a269",
	storageBucket: "blog2517-5a269.appspot.com",
	messagingSenderId: "718677454546",
	appId: "1:718677454546:web:33a992779bcb193289c70b",
	measurementId: "G-SDSQ540KHD"
};

firebase.initializeApp(firebaseConfig);

export const ref = firebase.database().ref();
export const firebaseAuth = firebase.auth;
