#!/usr/bin/env sh
# Rebuild app/index.html from the source parts. Needs python3 only.
set -e
# Windows Python defaults to cp1252 and CRLF; the sources are UTF-8 and the output must be LF.
export PYTHONUTF8=1
cd "$(dirname "$0")"
mkdir -p hs/project
python3 gen_editor.py
python3 assemble.py
python3 - <<'PY'
import re
h = open('hs/project/Main.dc.html').read()
h = re.sub(r'<link rel="stylesheet" href="https://fonts\.googleapis\.com/css2[^"]*">', '<link rel="stylesheet" href="./fonts/fonts.css">', h)
open('../app/index.html', 'w', newline='\n').write(h)
PY
echo "Built ../app/index.html"
