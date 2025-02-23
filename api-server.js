const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const { auth } = require("express-oauth2-jwt-bearer");
const authConfig = require("./src/auth_config.json");
const { path} = require("path");
const spawn = require("child_process").spawn;

const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );

  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

const checkJwt = auth({
  audience: authConfig.audience,
  issuerBaseURL: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

app.get("/api/external", checkJwt, (req, res) => {
  res.send({
    msg: "Your access token was successfully validated!",
  });
});

app.listen(port, () => console.log(`API Server listening on port ${port}`));

app.get('/runGame', checkJwt, (req, res) => {
  const jarPath = ".\\GameServer\\src\\main\\resources\\game\\desktop-2.5.4.jar";
  
  const gameProcess = spawn('java', ['-jar', jarPath]);

  let output = "";
  let errorOutput = "";

  gameProcess.stdout.on('data', (data) => {
    output += data.toString();
  });

  gameProcess.stderr.on('data', (data) => {
    errorOutput += data.toString();
  })

  gameProcess.on('close', (code) => {
    if (code === 0) {
      let parsedOutput = output.split("\r\n");
      let password;
      for (let elem in parsedOutput) {
        
        if (parsedOutput[elem].includes("PASSWORD")) {
          password = parsedOutput[elem].split("\t")[1];
        }
      }
      res.json({
        success: true,
        output: password
      });
    } else {
      res.status(500).json({
        success: false,
        error: `Process failed with code ${code}`,
        errorOutput: errorOutput
      });
    }
  })
})