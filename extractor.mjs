/*
MIT License

Copyright (c) 2024 martin0300

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import fs from "fs";
import express from "express";
import zlib from "zlib";
import ip from "ip";
import socksv5 from "@heroku/socksv5";

const PORT = 9999;
var wasConnected = false;

const { createServer } = socksv5;

const app = express();
const proxy = createServer((info, accept, deny) => {
    if (!wasConnected) {
        console.log("Proxy connected! Waiting for connection from client...");
    }
    wasConnected = true;

    if (info.dstPort === 80) {
        info.dstAddr = "localhost";
    }

    accept();
});

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

function commonBackupEndpoint(req, res) {
    console.log("Getting data...");
    decodeSaveData(req.body.saveData);
    res.sendStatus(200);
    console.log("Finished");
    console.log("Save data saved to saveFiles folder!");
    setTimeout(() => {
        process.exit(0);
    }, 1000);
}

init();

app.post("/server/getAccountURL.php", (req, res) => {
    console.log("Got connection!");
    res.send("http://game.gdpseditor.com");
});

app.post("/database/accounts/backupGJAccountNew.php", express.urlencoded({ extended: true, limit: 52428800 }), (req, res) => {
    commonBackupEndpoint(req, res);
});

//For GDPS Editor 2.2 Subzero 2.2.12
app.post("/serverse/accounts/backupGJAccountNew.php", express.urlencoded({ extended: true, limit: 52428800 }), (req, res) => {
    commonBackupEndpoint(req, res);
});

proxy.listen(PORT, ip.address(), () => {
    app.listen(80, () => {
        console.log(`Proxy IP: ${ip.address()}`);
        console.log(`Proxy Port: ${PORT}`);
        console.log("Waiting for connection...");
    });
});

proxy.useAuth(socksv5.auth.None());
