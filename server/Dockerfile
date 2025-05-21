FROM node:20.11.1-alpine3.19

WORKDIR /app

# Install pnpm using corepack (included in Node.js 20+)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy package files
COPY package.json pnpm-lock.yaml ./

# Install dependencies with retry logic
RUN --mount=type=cache,target=/root/.pnpm-store \
    pnpm install --frozen-lockfile --network-timeout 100000

# Copy source code
COPY . .

# Build the application
RUN pnpm build

# Set environment variables
ENV NODE_ENV=production

EXPOSE 3000

# Create startup script with proper line endings
RUN printf '#!/bin/sh\n\
echo "Waiting for MongoDB..."\n\
sleep 5\n\
echo "Seeding categories..."\n\
node dist/scripts/seedCategories.js\n\
echo "Starting server..."\n\
node dist/index.js' > /app/start.sh && chmod +x /app/start.sh

CMD ["/app/start.sh"] 