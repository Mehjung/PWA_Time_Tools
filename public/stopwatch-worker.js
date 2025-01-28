let interval;

self.onmessage = function (e) {
  switch (e.data.type) {
    case "START":
      interval = setInterval(() => {
        self.postMessage({ type: "TICK" });
      }, 10);
      break;
    case "PAUSE":
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      break;
    case "RESET":
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      break;
  }
};
