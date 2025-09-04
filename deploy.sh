#!/bin/bash

echo "开始构建CANN助手应用..."

# 安装依赖
npm install

# 构建生产版本
npm run build

echo "构建完成！"
echo "构建文件位于 build/ 目录"
echo "可以将 build/ 目录部署到任何静态文件服务器"

# 可选：启动本地服务器预览
echo "是否启动本地预览服务器？(y/n)"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "启动预览服务器..."
    npx serve -s build -l 3000
fi