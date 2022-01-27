# Build stage
FROM golang:1.16-alpine3.13 AS build
WORKDIR /app
COPY . .

RUN go mod download
RUN go build -o rating rating.go

# Run stage
FROM alpine:3.13
WORKDIR /app
COPY --from=build /app/rating .

EXPOSE 8181
CMD [ "/app/rating" ]