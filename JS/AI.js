const URL = "../my_model/";
let model, webcam, ctx, labelContainer, maxPredictions;

const CORRECT_LABEL = "Bạn đang tập trung trong khi thiền";
const INCORRECT_LABEL = "Bạn đang mất tập trung khi thiền.";

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmPose.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const size = 200;
  const flip = true;
  webcam = new tmPose.Webcam(size, size, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  // append/get elements to the DOM
  const canvas = document.getElementById("canvas");
  canvas.width = size;
  canvas.height = size;
  ctx = canvas.getContext("2d");
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // and class labels
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop(timestamp) {
  webcam.update(); // update the webcam frame
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  // Prediction #1: run input through posenet
  const { pose, posenetOutput } = await model.estimatePose(webcam.canvas);
  // Prediction 2: run input through teachable machine classification model
  const prediction = await model.predict(posenetOutput);

  let message = "";

  for (let i = 0; i < maxPredictions; i++) {
    // Check if prediction matches incorrect label
    if (prediction[i].className == INCORRECT_LABEL) {
      if (prediction[i].probability > 0.7) {
        message = "Sai tư thế! Vui lòng điều chỉnh.";
        pause();
        console.error(message);
        const classPrediction =
          prediction[i].className + ": " + prediction[i].probability.toFixed(2);
        await setMessage(classPrediction);

        const isOk = confirm(message);

        if (isOk) {
        } else {
          webcam.clode();
          return;
        }
        break; // only show one message per prediction
      }
    } else {
      play();
      const classPrediction =
        prediction[i].className + ": " + prediction[i].probability.toFixed(2);
      labelContainer.textContent = classPrediction;
    }
  }
  // Update message on the screen

  // finally draw the poses
  drawPose(pose);
}

function pause() {
  const audio = document.getElementById("myAudio");
  audio.pause(); // Dừng video
}

function play() {
  const audio = document.getElementById("myAudio");
  audio.play(); // Dừng video
}

async function setMessage(message) {
  document.getElementById("label-container").textContent = message;
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return;
}

function drawPose(pose) {
  if (webcam.canvas) {
    ctx.drawImage(webcam.canvas, 0, 0);
    // draw the keypoints and skeleton
    if (pose) {
      const minPartConfidence = 0.5;
      tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx);
      tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx);
    }
  }
}
