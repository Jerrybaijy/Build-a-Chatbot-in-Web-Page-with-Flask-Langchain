# 使用官方的 Python 基础镜像
# 推荐使用 slim 版本以减小镜像体积
FROM python:3.11-slim

# 设置容器内的工作目录
WORKDIR /app

# ----------------- 依赖安装阶段 -----------------

# 复制 requirements.txt 文件到容器的 /app 目录
# 这一步是为了利用 Docker 的缓存机制：如果 requirements.txt 没有变化，
# 依赖安装步骤将不会重复执行。
COPY requirements.txt .

# 安装所有 Python 依赖
# --no-cache-dir 选项用于避免将缓存写入最终镜像层，进一步减小体积
RUN pip install --no-cache-dir -r requirements.txt

# ----------------- 应用文件复制阶段 -----------------

# 复制应用代码。注意，这将复制所有文件，包括 app.py, .env, templates/, static/
# 推荐创建一个 .dockerignore 文件来排除 .env, .git 等敏感/非必需文件
COPY . .

# ----------------- 配置和运行阶段 -----------------

# 暴露 Flask 应用使用的端口 (默认为 5000)
EXPOSE 5000

# 启动 Gunicorn 或 Waitress 等生产级 WSGI 服务器是更好的选择，
# 但对于简单的 Docker 示例，我们使用 Python/Flask 的内置服务器。
# 
# ⚠️ 注意: 生产环境中应使用 Gunicorn 或 uWSGI 来启动应用
# CMD ["gunicorn", "--bind", "0.0.0.0:5000", "app:app"]
#
# 对于本地测试和开发，使用 Flask 内置服务器:
# Python 启动命令
CMD ["python", "app.py"]