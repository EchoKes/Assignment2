FROM mysql:latest

COPY commentDB.sql /docker-entrypoint-initdb.d/

RUN /entrypoint.sh

# This is for documentation purposes only.
# To actually open the port, runtime parameters
# must be supplied to the docker command.
EXPOSE 8186