@echo off
REM ===========================================================================
REM  Version PORTABLE de run_bridge.bat (pour un AUTRE PC, ex. collegue)
REM  ---------------------------------------------------------------------------
REM  Pont TCP : telephone (Wi-Fi) -> CE PC :5000 -> Pi 192.168.100.10:5000 (cable).
REM  Aucun chemin en dur : se lance depuis SON PROPRE dossier (%~dp0) et utilise
REM  le node du PATH. A placer DANS LE MEME DOSSIER que bridge.js.
REM
REM  Pre-requis sur ce PC :
REM    1) Node.js installe (node doit etre dans le PATH).
REM    2) bridge.js present a cote de ce .bat.
REM    3) UNIQUEMENT necessaire si des TELEPHONES doivent se connecter en Wi-Fi.
REM       (Le PC qui controle via navigateur n'en a PAS besoin : il ouvre
REM        directement http://192.168.100.10:5000.)
REM    4) Dans l'app : API_URL = http://<IP-Wi-Fi-de-CE-PC>:5000  (src/constants/config.js).
REM
REM  Demarrage auto : Win+R -> shell:startup -> y placer un raccourci vers ce .bat.
REM ===========================================================================
cd /d "%~dp0"
node bridge.js
pause
