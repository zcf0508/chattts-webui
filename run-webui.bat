@REM 设置环境变量
set HTTP_PROXY="http://127.0.0.1:7890"
set HTTPS_PROXY="http://127.0.0.1:7890"

@REM 切换 python 虚拟环境
call .\venv\Scripts\activate

set PORT=3615
call node .output/server/index.mjs 
