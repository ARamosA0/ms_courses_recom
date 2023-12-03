FROM kong
COPY . . 
RUN apt-get update && apt-get install vim 
RUN cp /etc/kong/kong.conf.default /etc/kong/kong.conf
USER kong
