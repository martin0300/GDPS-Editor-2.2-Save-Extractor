import socksv5 from "socksv5";
const { createServer } = socksv5;

import express from "express";
import fs from "fs";
import zlib from "zlib";
import ip from "ip";

const app = express();
const debug = true;
const proxyPort = 9999;
const serverPort = 80;
const ipAddress = ip.address();

function init() {
    console.log("Setting up...");
    if (!fs.existsSync("saveFiles")) {
        fs.mkdirSync("saveFiles");
    }
}

//interceptor
function decodeSaveData(saveData) {
    var splitData = saveData.split(";");
    var CCGameManager = splitData[0];
    var CCLocalLevels = splitData[1];

    var CCGameManagerUnBase64 = Buffer.from(CCGameManager, "base64");
    var CCLocalLevelsUnBase64 = Buffer.from(CCLocalLevels, "base64");

    var CCGameManagerDecompressed = zlib.gunzipSync(CCGameManagerUnBase64);
    var CCLocalLevelsDecompressed = zlib.gunzipSync(CCLocalLevelsUnBase64);

    console.log("Saving files...");
    fs.writeFileSync("saveFiles/CCGameManager.dat", CCGameManagerDecompressed.toString("utf-8"));
    fs.writeFileSync("saveFiles/CCLocalLevels.dat", CCLocalLevelsDecompressed.toString("utf-8"));
    return;
}

app.post("/server/getAccountURL.php", (req, res) => {
    console.log("Got connection!");
    res.status(200).send("http://game.gdpseditor.com");
});

app.post("/database/accounts/backupGJAccountNew.php", express.urlencoded({ extended: true, limit: "50mb" }), (req, res) => {
    console.log("Getting data...");
    console.log(req.body);
    /*decodeSaveData(req.body.saveData);
    res.sendStatus(200);
    console.log("Finished");
    console.log("Save data saved to saveFiles folder!");
    process.exit(0);*/
});

/*app.use((err, req, res, next) => {
    console.error(err.stack);
});

app.use((req, res, next) => {
    console.log("Received request:");
    console.log("Request Method:", req.method);
    console.log("Request URL:", req.url);
    console.log("Request Headers:", req.headers);
    console.log("Request Body:", req.body); // For POST or other request methods with a request body
    console.log("-----------------------------------------");
    next(); // Continue processing the request
});

// Define a route that responds with a 200 OK for all requests
app.all("*", (req, res) => {
    res.status(404).send("OK");
});*/

init();

//proxy
const server = createServer((info, accept, deny) => {
    if (debug) {
        console.log(`New SOCKS connection from ${info.srcAddr}:${info.srcPort} to ${info.dstAddr}:${info.dstPort}`);
    }
    //only redirect connections going to port 80
    if (info.dstPort == 80) {
        var socket;
        if (debug) {
            console.log("Redirecting to interceptor server");
        }
        if ((socket = accept(true))) {
            const failBody = "Not found";
            const failResponse = ["HTTP/1.1 404 Not found", "Connection: close", "Content-Type: text/plain", "Content-Length: " + Buffer.byteLength(failBody), "", failBody].join("\r\n");

            const getAccountURLBody = "http://game.gdpseditor.com";
            var getAccountURLResponse = ["HTTP/1.1 200 OK", "Connection: close", "Content-Type: text/plain", "Content-Length: " + Buffer.byteLength(getAccountURLBody), "", getAccountURLBody].join(
                "\r\n"
            );

            socket.on("data", (data) => {
                var requestData = data.toString();
                console.log(requestData);
                var requestLines = requestData.split("\r\n");

                if (requestLines[1].includes("game.gdpseditor.com")) {
                    if (requestLines[0].includes("/server/getAccountURL.php")) {
                        if (debug) {
                            console.log("Sending getAccountURL response...");
                        }
                        socket.end(getAccountURLResponse);
                    } else {
                        socket.end(failResponse);
                    }
                } else {
                    socket.end(failResponse);
                }
            });
        }
        info.dstAddr = "127.0.0.1";
    } else {
        accept();
    }
});

//start SOCKS proxy
server.listen(proxyPort, ipAddress, () => {
    console.log(`SOCKS Proxy listening on port ${proxyPort}`);
    console.log(`Server address: ${ipAddress}`);
    console.log(`Server port: ${proxyPort}`);
    //start interceptor server
    app.listen(serverPort, () => {
        console.log("Waiting for connection...");
    });
});

server.useAuth(socksv5.auth.None());
