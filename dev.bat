@echo off
set "PATH=C:\Program Files\nodejs;%APPDATA%\npm;%PATH%"
echo Starting Synapses Investments Development Server on http://localhost:3000 ...
call "C:\Program Files\nodejs\npm.cmd" run dev
