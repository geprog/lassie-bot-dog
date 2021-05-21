FROM golang:1.16

FROM scratch

# Copy CA certificates to prevent x509: certificate signed by unknown authority errors
COPY --from=0 /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/ca-certificates.crt

COPY lassie-bot-dog /lassie-bot-dog

ENTRYPOINT ["/lassie-bot-dog"]
