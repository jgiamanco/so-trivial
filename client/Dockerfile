# Build stage
FROM node:20.11.1-alpine3.19 as build

# Install pnpm using corepack (included in Node.js 20+)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with retry logic
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --network-timeout 100000

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Production stage
FROM nginx:1.25.3-alpine

# Copy built files from build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"] 