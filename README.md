# drawbot
A simple black and white drawbot, works on scribbl.

<h1> Installation </h1>
You can download it as a precompiled or compile it from scratch. You can find precompiled version <a href="">here</a>
<h2> Compile from source </h2>
You need to have node and python installed. Afterwards you begin by running these commands:
```
$ git clone https://github.com/cobs0n/drawbot
$ cd drawbot/
$ sudo pip3 install -r requirements.txt
$ npm install electron --save-dev
$ npm install electron-packager -g
$ pyinstaller --onefile draw.py 
$ electron-packager . drawbot --arch=x64 --asar
```
Afterwards you will need to draw.exe inside the dist folder and move it to the Drawbot-win32-x64 folder and then you can start the Drawbot app.

<h2> How does it work? </h2>
Simply open the app, select an image, go into overlay mode, scale or move the image as you desire, go back to main menu and press y. The bot will start drawing.
![test](https://i.imgur.com/DB2yprc.gif)
<h2> Where does it work? </h2>
Technically universal, just make sure to select the brush tool and set to 1px or the smallest option for brush tool and execute. The bot will draw at your image with your mouse.
<h3> Scribbl </h3>
✅<strong>WORKS!</strong>✅, more complex drawings may take a little while to render for everyone in the participants but it does fully work great. 
<h3> Gartic Phone </h3>
❌<strong>PATCHED</strong>❌, gartic phone may make you think that your drawing has been drawn but in reality it has blocked it. After a couple tests I only got at best partial results and othertimes nothing at all. This probably due to their rate limitting.
<h3> Jackbox </h3>
❔<strong>DIDN'T TEST</strong>❔, I assume that it might have the same situation like gartic phone but I never bothered making a twitch account and testing there, you can try testing it yourself there.

<h1> Support </h1>
This project I made merely for fun but I do welcome donations. Here are my crypto addresses:

# XMR Donations
<img src="https://cryptologos.cc/logos/monero-xmr-logo.png?v=032" alt="XMR" width="200"/>


4BEHHRhHMrYC3yQ5Xv71eDXeiUpshLXMHC7JWYrotAreXMknEjmZU38HMFCXUM43YoFya7qBD3Q5R61a13NnyA35Lst38NY

# Bitcoin Donations
<img src="https://cryptologos.cc/logos/bitcoin-btc-logo.png?v=032" alt="BTC" width="200"/>


bc1qn0vyhvw53825kgtuyx6kjuhs6zt3dq89j8vgz3

# Litecoin Donations
<img src="https://cryptologos.cc/logos/litecoin-ltc-logo.png?v=032" alt="LTC" width="200"/>


LeYFT19HmytwLyMdvF6K7bg2VVyZzNERww

