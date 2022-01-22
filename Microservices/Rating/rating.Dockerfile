#
# Build
#

FROM golang:1.16-buster AS build

WORKDIR /app

COPY go.mod .
COPY go.sum .
RUN go mod download

COPY *.go ./

RUN go build -o /rating

##
## Deploy
##

FROM gcr.io/distroless/base-debian10

WORKDIR /
COPY --from=build /rating /rating
EXPOSE 8181
USER nonroot:nonroot

ENTRYPOINT ["/rating"]