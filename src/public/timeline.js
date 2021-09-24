const container = document.getElementById("visualization");
const items = new vis.DataSet();
const options = {
  rollingMode: {
    follow: true,
    offset: 0.9
  },
  start: Date.now(),
  end: Date.now() + 50000
};
const timeline = new vis.Timeline(container, items, options);
const socket = io();
socket.on("data", (arg) => {
  let textToSend = `
  🙂: ${arg.name}<br>
  🕐: ${arg.time}<br>
  📝: ${arg.message}
  `;
  items.add({ id: Date.now(), content: textToSend, start: Date.now() });
});