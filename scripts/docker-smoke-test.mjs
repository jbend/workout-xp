import { execSync, spawnSync } from "node:child_process";

const IMAGE = process.env.DOCKER_IMAGE ?? "workout-xp:local";
const CONTAINER = process.env.DOCKER_CONTAINER ?? "workout-xp-test";
const TIMEOUT_MS = Number(process.env.DOCKER_TIMEOUT_MS ?? "30000");
const POLL_MS = 500;

function run(command, args) {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) {
    const detail = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${command} ${args.join(" ")} failed${detail ? `: ${detail}` : ""}`);
  }
  return result.stdout.trim();
}

function cleanup() {
  spawnSync("docker", ["rm", "-f", CONTAINER], { stdio: "ignore" });
}

function isContainerRunning(name) {
  const result = spawnSync("docker", ["inspect", "-f", "{{.State.Running}}", name], {
    encoding: "utf8",
  });
  return result.status === 0 && result.stdout.trim() === "true";
}

function printContainerLogs(name) {
  try {
    const logs = execSync(`docker logs ${name}`, { encoding: "utf8" });
    if (logs.trim()) {
      console.error("\nContainer logs:\n" + logs);
    }
  } catch {
    // Container may already be gone.
  }
}

function getHostPort(containerId) {
  const output = run("docker", ["port", containerId, "3000/tcp"]);
  const match = output.match(/:(\d+)\s*$/m);
  if (!match) {
    throw new Error(`Could not determine host port for container ${containerId}`);
  }
  return Number(match[1]);
}

function assertContainerRunning(containerId) {
  if (!isContainerRunning(containerId)) {
    printContainerLogs(containerId);
    throw new Error(`Container ${containerId} exited before the smoke test completed`);
  }
}

async function waitForServer(port) {
  const deadline = Date.now() + TIMEOUT_MS;

  while (Date.now() < deadline) {
    assertContainerRunning(CONTAINER);

    try {
      const response = await fetch(`http://127.0.0.1:${port}/`);
      if (response.ok) {
        return response.status;
      }
    } catch {
      // Server not ready yet.
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_MS));
  }

  throw new Error(`Timed out after ${TIMEOUT_MS}ms waiting for http://127.0.0.1:${port}/`);
}

async function main() {
  cleanup();

  console.log(`Starting ${IMAGE} as ${CONTAINER}...`);
  const containerId = run("docker", [
    "run",
    "-d",
    "--rm",
    "--name",
    CONTAINER,
    "-p",
    "0:3000",
    IMAGE,
  ]);

  assertContainerRunning(containerId);

  const port = getHostPort(containerId);
  console.log(`Mapped container port 3000 to host port ${port}`);

  const status = await waitForServer(port);
  console.log(`Smoke test passed: GET / returned ${status}`);
}

main()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    printContainerLogs(CONTAINER);
    process.exitCode = 1;
  })
  .finally(() => {
    cleanup();
  });
