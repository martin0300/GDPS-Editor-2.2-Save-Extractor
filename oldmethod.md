# Old method

## How to use

**WARNING: This project requires you to have a Pi-hole server and a WiFi capable device. (Built-in or external WiFi dongle)**

**This guide only applies to Windows PCs, ~~but instructions for Linux are coming soon~~. Your computer must be configured to use the Pi-hole DNS Server!**

1. Install **Node.js**, **npm** and **git** if not installed
    - **https://nodejs.org/**
    - **https://git-scm.com/**
2. Open terminal
    - Search for **cmd** or **Windows Terminal** in windows search bar
3. Clone repository
   `git clone https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor`
4. Run `npm i` and `node extractor.mjs --legacy` in your terminal
    - This might need administrator privileges to proceed
5. Setup Pi-hole settings
    - Add **gdpseditor.com** and point it to your computer's local ip in _Local DNS Records_ (Local DNS -> DNS Records)
        - Your local ip will be printed when running `node extractor.mjs --legacy`
    - Add **game.gdpseditor.com** and point it to **gdpseditor.com** in _Local CNAME Records_ (Local DNS -> CNAME Records)
6. Setup Windows settings
    - Disable IPv6 in network adapter settings ([Guide](https://support.nordvpn.com/hc/en-us/articles/19919186892305-How-to-disable-IPv6-on-Windows))
    - Create a WiFi hotspot ([Guide](https://support.microsoft.com/en-us/windows/use-your-windows-pc-as-a-mobile-hotspot-c89b0fad-72d5-41e8-f7ea-406ad9036b85))
    - Run `ipconfig /flushdns` in your terminal
7. Connect your phone to your computer's WiFi hotspot
8. Open GDPS Editor 2.2
9. Click settings -> Account
    - If you already have an account, a **Save** button will be visible. If so, proceed directly to step 12.
    - If not, click **Login** and follow the instructions in the next steps.
10. Input any username and password you want then click on login
    - Username needs to be **minimum 3 characters long**
    - Password needs to be **minimum 6 characters long**
    - If an error occurs, proceed to the [Troubleshooting section](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor?tab=readme-ov-file#login-failure)
11. Go back to the main menu and click settings -> Account again
12. Click Save and wait for it to finish
    - If an error occurs, proceed to the [Troubleshooting section](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor?tab=readme-ov-file#backup-failed--data-size-limit-exceeded)
13. Wait for script to write: **Finished**
14. Browse the save data from the folder **saveFiles** using **https://gdcolon.com/gdsave/**
15. Cleanup
    - Disable WiFi hotspot
    - Reenable IPv6 in network adapter settings
    - Reconnect phone to home network

## How does it work?

This works by creating a capture server and pointing **gdpseditor.com** and **game.gdpseditor.com** to it using Pi-hole. Then when the client on your device tries to backup the data it will be redirected to the capture server and it will be saved to **CCGameManager** and **CCLocalLevels**.

## Credits

-   WiFi hotspot guide by **[Microsoft support](https://support.microsoft.com)**
-   IPv6 disable guide by **[NordVPN support](https://support.nordvpn.com/)**

You can find the rest of the credits [here](https://github.com/martin0300/GDPS-Editor-2.2-Save-Extractor?tab=readme-ov-file#credits).
