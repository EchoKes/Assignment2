#
# Build
#

FROM golang:1.16-buster AS build

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY *.go ./

RUN go build -o /comment

##
## Deploy
##

FROM gcr.io/distroless/base-debian10

WORKDIR /
COPY --from=build /comment /comment
EXPOSE 8182
USER nonroot:nonroot

ENTRYPOINT ["/comment"]