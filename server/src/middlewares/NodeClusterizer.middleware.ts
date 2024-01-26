import cluster from "cluster";
import os from "os";

export function nodeClusterizer(main: () => void) {
  const numberOfCores = os.cpus().length;

  if (cluster.isPrimary) {
    console.log(`#  Process:Master | pid:${process.pid} | status:started`);
    for (let i = 3; i < numberOfCores; i++) {
      cluster.fork();
    }
    cluster.on("exit", (worker) => {
      console.log(
        `#  Process:Worker | pid:${worker.process.pid} | status:stopped working`
      );
      cluster.fork();
    });
    cluster.on("fork", (worker) => {
      console.log(
        `#  Process:Worker | pid:${worker.process.pid} | status:started`
      );
    });
  } else {
    main();
  }
}
