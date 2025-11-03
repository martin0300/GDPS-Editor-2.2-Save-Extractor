/*
MIT License

Copyright (c) 2025 martin0300

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
import os from "os";
import socksv5 from "@heroku/socksv5";

const PORT = 9999;
var serverPort = 9998;
var debug = false;
var sizeLimit = "100mb";
const ver = "2.2-stable";
var wasConnected = false;

const ipAddresses = getIPAddresses();
const openProxies = [];
const { createServer } = socksv5;

const app = express();

function init() {
    console.log("Setting up...");
    if (!fs.existsSync("saveFiles")) {
        fs.mkdirSync("saveFiles");
    }
}

function getIPAddresses() {
    const interfacesObj = os.networkInterfaces();
    const addresses = [];
    for (const ifaceArray of Object.values(interfacesObj)) {
        for (const addr of ifaceArray) {
            if (!addr.internal && addr.family === "IPv4") {
                addresses.push(addr.address);
            }
        }
    }
    return addresses;
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

function removeSensitiveKeys(obj) {
    const keysToRemove = ["gjp", "gjp2", "password", "saveData"];
    return Object.fromEntries(Object.entries(obj).filter(([key]) => !keysToRemove.includes(key)));
}

function commonBackupEndpoint(req, res) {
    console.log("Getting data...");
    if (debug) {
        console.log("DEBUG:");
        console.log(removeSensitiveKeys(req.body));
        console.log("------");
    }
    decodeSaveData(req.body.saveData);
    res.sendStatus(200);
    console.log("Finished");
    console.log("Save data saved to saveFiles folder!");
    setTimeout(() => {
        process.exit(0);
    }, 1000);
}

function errorHandler(err, req, res, next) {
    if (err) {
        console.log("Data size limit exceeded!");
        if (debug) {
            console.log("DEBUG:");
            console.log(err);
            console.log("------");
        }
        res.sendStatus(400);
    } else {
        next();
    }
}

function checkArgs() {
    const args = process.argv.slice(2);

    if (args.includes("--help") || args.includes("-h")) {
        console.log("Usage: node extractor.mjs [options]");
        console.log("Options: --help, --debug, --version, --1gbsize");
        process.exit(0);
    }
    if (args.includes("--debug") || args.includes("-d")) {
        debug = true;
    }
    if (args.includes("--version") || args.includes("-v")) {
        console.log(`GDPS-Editor-2.2-Save-Extractor V${ver}`);
        process.exit(0);
    }
    if (args.includes("--1gbsize")) {
        console.log("Activating 1GB data size, this might cause issues!");
        sizeLimit = "1gb";
    }
    if (args.includes("--legacy") || args.includes("-l")) {
        console.log("Legacy mode is currently active. You might need administrator privileges to proceed.");
        serverPort = 80;
    }
}

checkArgs();
init();

app.post("/server/accounts/loginGJAccount.php", express.urlencoded({ extended: true }), (req, res) => {
    if (debug) {
        console.log("DEBUG:");
        console.log(removeSensitiveKeys(req.body));
        console.log("------");
    }
    console.log(`Got auth request with username: ${req.body.userName}!`);
    res.send("1,1").status(200);
});

app.post("/server/getAccountURL.php", (req, res) => {
    console.log("Got connection!");
    res.send("http://game.gdpseditor.com");
});

app.post("/database/accounts/backupGJAccountNew.php", express.urlencoded({ extended: true, limit: sizeLimit }), errorHandler, (req, res) => {
    if (debug) {
        console.log("DEBUG: Using database endpoint");
    }
    commonBackupEndpoint(req, res);
});

//For older versions using the serverse endpoint
app.post("/serverse/accounts/backupGJAccountNew.php", express.urlencoded({ extended: true, limit: sizeLimit }), errorHandler, (req, res) => {
    if (debug) {
        console.log("DEBUG: Using serverse endpoint");
    }
    commonBackupEndpoint(req, res);
});

//Test endpoint
app.get("/", (req, res) => {
    if (debug) {
        console.log("DEBUG: Test endpoint reached!");
    }
    res.send("<h1>GDPS-Editor-2.2-Save-Extractor is reachable!</h1>");
});

if (debug) {
    console.log("DEBUG: Debug mode enabled!");
}

const server = app.listen(serverPort, () => {
    console.log(`Running version: V${ver}\n`);
    console.log(`Proxy IP: ${ip.address()} (Test address: http://${ip.address()}:${serverPort}/)`);
    console.log(`Proxy Port: ${PORT}`);
    console.log(`\nOn the target device, you can test if the server is reachable by visiting the test address in a web browser, without connecting to the proxy.\n`);

    //Because the "ip" package is unreliable
    console.log("Other possible IP addresses:");
    for (const address of ipAddresses) {
        const proxy = createServer((info, accept, deny) => {
            if (!wasConnected) {
                console.log("Proxy connected! Waiting for connection from client...");
            }
            wasConnected = true;

            if (info.dstPort === 80) {
                info.dstAddr = "localhost";
                info.dstPort = serverPort;
            }

            accept();
        });

        proxy.listen(PORT, address, () => {
            if (debug) {
                console.log(`DEBUG: Proxy listening on ${address}:${PORT}`);
            }
        });
        proxy.on("error", (err) => {
            if (debug) {
                console.log(`DEBUG: Could not bind to address ${address}`);
                console.log("DEBUG:");
                console.log(err);
                console.log("------");
            }
        });

        proxy.useAuth(socksv5.auth.None());
        openProxies.push(proxy);

        if (address !== ip.address()) {
            console.log(`- ${address} (Test address: http://${address}:${serverPort}/)`);
        }
    }
    console.log("\nWaiting for connection...");
});

server.on("error", (err) => {
    console.log("You need administrator privileges to proceed.");
    if (debug) {
        console.log("DEBUG:");
        console.log(err);
        console.log("------");
    }
    process.exit(0);
});
