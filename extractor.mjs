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

function init() {
    console.log("Setting up...");
    if (!fs.existsSync("saveFiles")) {
        fs.mkdirSync("saveFiles");
    }
}

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

const server = createServer((info, accept, deny) => {
    if (debug) {
        console.log(`New SOCKS connection from ${info.srcAddr}:${info.srcPort} to ${info.dstAddr}:${info.dstPort}`);
    }
    //only redirect connections going to port 80
    if (info.dstPort == 80) {
        if (debug) {
            console.log("Redirecting to interceptor server");
        }
        info.dstAddr = "127.0.0.1";
    }
    accept();
});

//start SOCKS proxy
server.listen(proxyPort, ip.address(), () => {
    console.log(`SOCKS Proxy listening on port ${proxyPort}`);
    console.log(`Server address: ${ip.address()}`);
    console.log(`Server port: ${proxyPort}`);
    //start interceptor server
    app.listen(serverPort, () => {
        console.log("Waiting for connection...");
    });
});

server.useAuth(socksv5.auth.None());
