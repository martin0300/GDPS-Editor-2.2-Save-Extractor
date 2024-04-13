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

const app = express();

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

app.post("/server/getAccountURL.php", (req, res) => {
    console.log("Got connection!");
    res.send("http://game.gdpseditor.com");
});

app.post("/database/accounts/backupGJAccountNew.php", express.urlencoded({ extended: true, limit: 52428800 }), (req, res) => {
    console.log("Getting data...");
    decodeSaveData(req.body.saveData);
    res.sendStatus(200);
    console.log("Finished");
    console.log("Save data saved to saveFiles folder!");
    process.exit(0);
});

app.listen(80, () => {
    console.log("Waiting for connection...");
});
