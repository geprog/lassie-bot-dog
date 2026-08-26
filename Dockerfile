FROM golang:1.27

FROM scratch

# Copy CA certificates to prevent x509: certificate signed by unknown authority errors
COPY --from=0 /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt


# goreleaser (dockers_v2) puts the binaries into <os>/<arch>/ inside the build context
ARG TARGETPLATFORM
COPY $TARGETPLATFORM/lassie-bot-dog /lassie-bot-dog

ENTRYPOINT ["/lassie-bot-dog"]
