#!/bin/bash

# CANN助手启动脚本
# 用于快速启动本地开发服务器

echo "🚀 启动CANN助手..."
echo "📂 项目目录: $(pwd)"
echo "🌐 服务地址: http://localhost:8000"
echo ""
echo "💡 提示: 按 Ctrl+C 停止服务"
echo "📱 移动端测试: 使用手机浏览器访问局域网IP:8000"
echo ""

# 检查Python是否可用
if command -v python3 &> /dev/null; then
    echo "✅ 使用 Python3 启动服务器..."
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✅ 使用 Python 启动服务器..."
    python -m http.server 8000
else
    echo "❌ 未找到Python，请安装Python后重试"
    echo "   或者直接在浏览器中打开 index.html 文件"
    exit 1
fi