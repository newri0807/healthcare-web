# syntax=docker/dockerfile:1
# 1. 빌드 단계 (Builder Stage)
FROM node:18-alpine as builder
WORKDIR /app

# 패키지 파일 먼저 복사 (캐시 효율을 위해)
COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm install

# 소스 코드 복사 및 빌드
COPY . .
RUN npm run build
# (참고: Vite는 빌드 결과물이 /app/dist 에 생깁니다)


# 2. 실행 단계 (Production Stage)
FROM nginx:alpine

# 👇 1번에서 만든 설정 파일을 Nginx 설정 폴더로 덮어쓰기 (필수)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# 빌드된 결과물을 Nginx가 서비스하는 폴더로 복사
COPY --from=builder /app/dist /usr/share/nginx/html

# 80번 포트 오픈
EXPOSE 80

# Nginx 실행
CMD ["nginx", "-g", "daemon off;"]