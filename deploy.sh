#!/bin/bash

# THE WAY Campaign Deployment Script
# 部署到腾讯云 CloudBase 和 Vercel

echo "🚀 开始部署 THE WAY: 柬埔寨厕所大富翁"

# 1. 构建项目
echo "📦 正在构建项目..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ 构建失败!"
    exit 1
fi

echo "✅ 构建完成"

# 2. 部署到 CloudBase (需要手动执行)
echo "☁️  部署到腾讯云 CloudBase:"
echo "   请运行：cloudbase hosting deploy"
echo ""

# 3. 部署到 Vercel (需要手动执行)  
echo "▲ 部署到 Vercel:"
echo "   请运行：vercel --prod"
echo ""

echo "✨ 部署指南："
echo "1. 确保已登录腾讯云：cloudbase login"
echo "2. 确保已登录 Vercel: vercel login"
echo "3. 运行相应的部署命令"
