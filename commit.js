const { exec } = require("child_process");
const path = require("path");
const projectPath = process.cwd();
exec(
  `git add . && git commit -m "${formatTimestamp(Date.now())}" `,
  { cwd: projectPath },
  (error) => {
    if (error) {
      console.log(`error: ${error}`);
      return;
    }
    console.log("git push origin master");
    exec("git push origin master", { cwd: projectPath });
  }
);

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
