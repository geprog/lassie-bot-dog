FROM golang:1.27.3@sha256:2920bb124f1a2e12a1d39f0cab756ae0068441ee1da7655dec7f5e374944095b

FROM scratch

# Copy CA certificates to prevent x509: certificate signed by unknown authority errors
COPY --from=0 /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt


# goreleaser (dockers_v2) puts the binaries into <os>/<arch>/ inside the build context
ARG TARGETPLATFORM
COPY $TARGETPLATFORM/lassie-bot-dog /lassie-bot-dog

ENTRYPOINT ["/lassie-bot-dog"]
