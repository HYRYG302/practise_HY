#!/bin/bash
# GitHub 推送脚本
# 用法: ./push-to-github.sh 你的令牌

if [ -z "$1" ]; then
  echo "❌ 请提供 GitHub 个人访问令牌"
  echo "用法: ./push-to-github.sh YOUR_TOKEN"
  exit 1
fi

TOKEN=$1
cd "$(dirname "$0")"

echo "🔗 配置远程仓库..."
git remote set-url origin "https://HYRYG302:${TOKEN}@github.com/HYRYG302/pomodoro-timer.git"

echo "📤 推送代码到 GitHub..."
git push -u origin main

echo "✅ 完成！"
# 注意：令牌已使用，建议前往 GitHub 删除此令牌并重新生成
