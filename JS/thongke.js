// import {soBai} from "./page.js"
var data = localStorage.getItem("soBai")
console.log(data);
const Bai = document.getElementById("soBai");
Bai.innerText = data;