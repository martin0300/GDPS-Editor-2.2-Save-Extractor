# GDPS-Editor-2.2-Save-Extractor

Extracts save data from GDPS Editor 2.2. **New method without Pi-hole and WiFi hotspot are coming soon.**
**If you have any questions [contact me](#contact-info), [create an issue](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/issues) or [write in the discussions](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor/discussions).**

# Why?

Because the GDPS Editor 2.2 servers has been shut down so you can't sync your account anymore and it's stuck on your device. With this tool you can export your save files to their respective **CCGameManager** and **CCLocalLevels** files to be able to backup your account or export your created levels for reupload from **CCLocalLevels**.

# How to use

**WARNING: This project requires you to have a Pi-hole server and a WiFi capable device. (Built-in or external WiFi dongle)**

**This guide only applies to Windows PCs, but instructions for Linux are coming soon. Your computer must be configured to use the Pi-hole DNS Server!**

1. Install **Node.js**, **npm** and **git** if not installed
    - **https://nodejs.org/**
    - **https://git-scm.com/**
2. Open terminal
    - Search for **cmd** or **Windows Terminal** in windows search bar
3. Clone repository
   `git clone https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor`
4. Run `npm i` and `node extractor.mjs` in your terminal
5. Setup Pi-hole settings
    - Add **gdpseditor.com** and point it to your computer's local ip in _Local DNS Records_ (Local DNS -> DNS Records)
        - Your local ip will be printed when running `node extractor.mjs`
    - Add **game.gdpseditor.com** and point it to **gdpseditor.com** in _Local CNAME Records_ (Local DNS -> CNAME Records)
6. Setup Windows settings
    - Disable IPv6 in network adapter settings ([Guide](https://support.nordvpn.com/hc/en-us/articles/19919186892305-How-to-disable-IPv6-on-Windows))
    - Create a WiFi hotspot ([Guide](https://support.microsoft.com/en-us/windows/use-your-windows-pc-as-a-mobile-hotspot-c89b0fad-72d5-41e8-f7ea-406ad9036b85))
    - Run `ipconfig /flushdns` in your terminal
7. Connect your phone to your computer's WiFi hotspot
8. Open GDPS Editor 2.2
9. Click settings -> Account -> Save and wait for it to finish
10. Wait for script to write _Finished_
11. Browse the save data from the folder **saveFiles** using **https://gdcolon.com/gdsave/**
12. Cleanup
    - Disable WiFi hotspot
    - Reenable IPv6 in network adapter settings
    - Reconnect phone to home network

# How does it work?

This works by creating a capture server and pointing **gdpseditor.com** and **game.gdpseditor.com** to it using Pi-hole.\
Then when the client on your device tries to backup the data it will be redirected to the capture server and it will be saved to **CCGameManager** and **CCLocalLevels**.

## Decoding logic

1. Get save data from POST request body.
2. Split save data at an **;** character.
3. Run **Base64** decode on both strings.
4. Decompress both files using **GZip**.

# Dependencies and usage

-   [express](https://github.com/expressjs/express) - Web server
-   [ip](https://github.com/indutny/node-ip) - Getting local ip address

# Credits

-   Project by **[martin0300](https://github.com/martin0300)** (me)
-   [Geometry Dash server docs](https://github.com/SMJSGaming/GDDocs/blob/master/README.md) by **[SMJSGaming](https://github.com/SMJSGaming)**
-   GD Save Explorer by **[GDColon](https://gdcolon.com/)**
-   WiFi hotspot guide by **[Microsoft support](https://support.microsoft.com)**
-   IPv6 disable guide by **[NordVPN support](https://support.nordvpn.com/)**

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
