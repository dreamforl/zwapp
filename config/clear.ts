export const clearBuild = async () => {
  await new Promise((resolve, reject) => {
    const child_process = require("child_process");
    child_process.exec(`npx rimraf dist`, (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      resolve(0);
    });
  });
};
