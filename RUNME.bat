@echo off

powershell -Command "node package-fixer.js"

:main
cls
echo What would you like to do?
echo [0] Exit
echo [1] Run
echo [2] Minify
echo [3] Compile
echo [4] Compress
echo [5] Decompress
choice /c 012345 /n /m "Choose an option: "
if errorlevel 6 (
    cls
    call :decompress
    goto :main
)
if errorlevel 5 (
    cls
    call :compress
    goto :main
)
if errorlevel 4 (
    cls
    call :compile
    goto :main
)
if errorlevel 3 (
    cls
    call :minify
    goto :main
)
if errorlevel 2 (
    cls
    call :run
    goto :main
)
cls
exit

:run
powershell -Command "node easyfuck-interpreter.js" || pause
exit /b

:minify
powershell -Command "node easyfuck-minifier.js"
pause
exit /b

:compile
powershell -Command "node easyfuck-compiler.js"
powershell -Command "pkg temp.js -t win"
for /f "delims=" %%a in ('type "tempData.txt"') do (
    set "p=%%a"
)
powershell -Command "Copy-Item -Path temp.exe -Destination %p%" >nul
del /q "tempData.txt"
del /q "temp.js"
del /q "temp.exe"
pause
exit /b

:compress
powershell -Command "node easyfuck-compressor.js"
pause
exit /b

:decompress
powershell -Command "node easyfuck-decompressor.js"
pause
exit /b