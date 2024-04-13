import socksv5 from "socksv5";
const { createServer } = socksv5;

import fs from "fs";
import zlib from "zlib";
import ip from "ip";

const debug = true;
const proxyPort = 9999;
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
            console.log("Reading data");
        }
        if ((socket = accept(true))) {
            //404 response
            const failBody = "Not found";
            const failResponse = ["HTTP/1.1 404 Not found", "Connection: close", "Content-Type: text/plain", "Content-Length: " + Buffer.byteLength(failBody), "", failBody].join("\r\n");

            //getAccountURL
            const getAccountURLBody = "http://game.gdpseditor.com";
            var getAccountURLResponse = ["HTTP/1.1 200 OK", "Connection: close", "Content-Type: text/html", "Content-Length: " + Buffer.byteLength(getAccountURLBody), "", getAccountURLBody].join(
                "\r\n"
            );

            //continue message
            const backupGJAccountNewStage1Response = "HTTP/1.1 100 Continue\r\n\r\n";

            //backup success
            const backupGJAccountNewSuccessBody = "OK";
            const backupGJAccountNewSuccessResponse = [
                "HTTP/1.1 200 OK",
                "Connection: close",
                "Content-Type: text/html",
                "Content-Length: " + Buffer.byteLength(backupGJAccountNewSuccessBody),
                "",
                backupGJAccountNewSuccessBody,
            ].join("\r\n");

            var saveDataBuffer = "";

            socket.on("data", (data) => {
                var requestData = data.toString();
                //console.log(requestData);
                var requestLines = requestData.split("\r\n");

                if (requestLines.length > 1 && requestLines[1].includes("game.gdpseditor.com")) {
                    if (requestLines[0].includes("/server/getAccountURL.php")) {
                        if (debug) {
                            console.log("Sending getAccountURL response...");
                        }
                        console.log("Got connection");
                        socket.end(getAccountURLResponse);
                    } else if (requestLines[0].includes("/database/accounts/backupGJAccountNew.php")) {
                        if (debug) {
                            console.log("Sending continue...");
                        }
                        socket.write(backupGJAccountNewStage1Response);
                    } else {
                        socket.end(failResponse);
                    }
                } else if (requestLines.length == 1) {
                    if (debug) {
                        console.log("Got new chunk");
                    }
                    saveDataBuffer += requestData;
                    if (requestData.includes("secret=Wmfv3899gc9")) {
                        if (debug) {
                            console.log("End of transmission");
                        }
                    }
                } else {
                    socket.end(failResponse);
                }
            });
        }
    } else {
        accept();
    }
});

//start SOCKS proxy
server.listen(proxyPort, ipAddress, () => {
    console.log(`SOCKS Proxy listening on port ${proxyPort}`);
    console.log(`Server address: ${ipAddress}`);
    console.log(`Server port: ${proxyPort}`);
});

server.useAuth(socksv5.auth.None());
