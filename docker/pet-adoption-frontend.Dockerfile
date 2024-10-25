# Create a build of the project
FROM node:20 AS build
WORKDIR /build
COPY . .

# Add network timeout so our action doesn't fail from loading a bajillion dependencies
RUN yarn install --network-timeout 300000
# Add --profile to use React Profiler DevTools for performance profiling
RUN yarn run build --profile

# Copy the build artifacts
FROM node:20
WORKDIR /app
COPY --from=build /build .

# Run the app
ENTRYPOINT exec yarn start
