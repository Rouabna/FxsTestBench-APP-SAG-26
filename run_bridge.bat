@echo off
REM Lance le pont TCP PC -> Pi (bridge.js) pour que le telephone (Wi-Fi) atteigne
REM le backend du Pi.  Telephone (Wi-Fi) -> PC 0.0.0.0:5000 -> Pi 192.168.100.10:5000
REM Double-cliquer pour demarrer, ou placer un raccourci dans le dossier Demarrage
REM de Windows (Win+R -> shell:startup) pour un lancement automatique a l'ouverture.
cd /d "D:\ing-pfe-bancTest\fxs-mobile"
"C:\nvm4w\nodejs\node.exe" bridge.js
pause
