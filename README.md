# GDPS-Editor-2.2-Save-Extractor

Extracts save data from GDPS Editor 2.2. \
**Project no longer requires you to have a Pi-Hole server and a WiFi capable device! It only needs it if you want to use the old method.**
**If you have any questions [contact me](#contact-info), [create an issue](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/blob/main/CONTRIBUTING.md) or [write in the discussions](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/discussions).**

# Why?

Because the GDPS Editor 2.2 servers has been shut down so you can't sync your account anymore and it's stuck on your device. With this tool you can export your save files to their respective **CCGameManager** and **CCLocalLevels** files to be able to backup your account or export your created levels for reupload from **CCLocalLevels**.

# Supported versions

## Tested

You can find all the tested versions [here](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/blob/main/versions.md).

## Untested

For versions not listed in the document it most likely will work but if not [create an issue](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/blob/main/CONTRIBUTING.md) and I'll look into it.

# How to use

**Make sure you're on the same network as your device! This only works on Android devices!**

1. Install **Node.js** and **npm** if not installed
    - **https://nodejs.org/**
2. Download repository by clicking Code -> Download zip or with this [direct link](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/archive/refs/heads/main.zip)
    - You can also use `git clone https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor` in your terminal if you have [git](https://git-scm.com/) installed.
3. Unpack the downloaded zip file
4. Open terminal and navigate to the downloaded directory
    - If you're on Windows, search for **cmd** or **Windows Terminal** in windows search bar
5. Run `npm i` and `node extractor.mjs` in your terminal
6. Setup phone settings (**Your computer's local IP and the proxy's port are printed when running extractor.mjs**)
    1. Download **[Tun2Socks](https://play.google.com/store/apps/details?id=com.elseplus.tun2socks)** from the play store
    2. Open downloaded app
    3. Enter your computer's **local IP address** into **Socks host**
    4. Enter the **proxy's port number** into **Port**
    5. Press connect button in the bottom right corner
    6. Wait for script to write: **Proxy connected! Waiting for connection from client...**
7. Open GDPS Editor 2.2
8. Click settings -> Account
    - If you already have an account, a **Save** button will be visible. If so, proceed directly to step 11.
    - If not, click **Login** and follow the instructions in the next steps.
9. Input any username and password you want then click on login
    - Username needs to be **minimum 3 characters long**
    - Password needs to be **minimum 6 characters long**
    - If an error occurs, proceed to the [Troubleshooting section](#login-failure)
10. Go back to the main menu and click settings -> Account again
11. Click Save and wait for it to finish
    - If an error occurs, proceed to the [Troubleshooting section](#backup-failed--data-size-limit-exceeded)
12. Wait for script to write: **Finished**
13. Browse the save data from the folder **saveFiles** using **https://gdcolon.com/gdsave/**
14. **Important! If you don't do this you will lose internet access on your device!**
    - Open **Tun2Socks** and press disconnect button in the bottom right corner

## Old method

If the old method worked better for you, you can find it [here](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/blob/main/oldmethod.md).

# Troubleshooting

## Login failure

If a login failure occurs or your game crashes when pressing **Login**, it usually means one of the following:

-   A connection to the server failed
-   The game version is incompatible with the server (You can check supported versions [here](#supported-versions))

Try the following steps:

1. **Restart both Tun2Socks and the extractor.**
2. Make sure your **device and computer are on the same network.**
3. **Double-check the proxy IP address and port number.**

If it still doesn't work, [**open an issue**](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/blob/main/CONTRIBUTING.md) and I'll take a look at it.

## Backup failed / Data size limit exceeded

If you get the message **"Backup failed. Please try again later."** or **"Data size limit exceeded!"**, it usually means one of the following:

-   A connection to the server failed
-   The game version is incompatible with the server (You can check supported versions [here](#supported-versions))
-   Your save file is too big. (This will also throw a **"Data size limit exceeded!"** error in your terminal)

Try the following steps:

1. **Restart both Tun2Socks and the extractor.**
2. Make sure your **device and computer are on the same network.**
3. **Double-check the proxy IP address and port number.**
4. In case of a **"Data size limit exceeded!"** error you can try the `--1gbsize` switch when starting the extractor. This can be done with the following command: `node extractor.mjs --1gbsize`

If it still doesn't work, [**open an issue**](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/blob/main/CONTRIBUTING.md) and I'll take a look at it.

# How does it work?

This works by creating a capture server and a proxy server and connecting to it using a proxy app on your device. The proxy redirects all connections to the GDPS Server to the capture server.
Then when the client on your device tries to backup the data it will be redirected to the capture server and it will be saved to **CCGameManager** and **CCLocalLevels**.

## Decoding logic

1. Get save data from POST request body.
2. Split save data at an **;** character.
3. Run **Base64** decode on both strings.
4. Decompress both files using **GZip**.

# Dependencies and usage

-   [express](https://github.com/expressjs/express) - Web server
-   [ip](https://github.com/indutny/node-ip) - Getting local ip address
-   [@heroku/socksv5](https://github.com/heroku/socksv5) - Proxy server

# Credits

-   Project by **[martin0300](https://github.com/martin0300)** (me)
-   [Geometry Dash server docs](https://github.com/SMJSGaming/GDDocs/blob/master/README.md) by **[SMJSGaming](https://github.com/SMJSGaming)**
-   GD Save Explorer by **[GDColon](https://gdcolon.com/)**

# Contact info

-   E-mail: martin0300a@gmail.com
-   Website: https://martin0300.github.io
-   GitHub: https://github.com/martin0300

# License

```
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
```
