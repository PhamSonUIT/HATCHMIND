var soBai = 0;

document.addEventListener("DOMContentLoaded", () => {
  var audio = document.getElementById("myAudio");
  audio.addEventListener("ended", () => {
    soBai = soBai + 1;
    console.log(soBai);
    localStorage.setItem("soBai", soBai);
  });

});
