FROM debian:bullseye-slim
   
COPY kong.deb /tmp/kong.deb
   
RUN set -ex; \
    apt-get update \
    && apt-get install --yes /tmp/kong.deb curl \
    && rm -rf /var/lib/apt/lists/* \
    && rm -rf /tmp/kong.deb \
    && chown kong:0 /usr/local/bin/kong \
    && chown -R kong:0 /usr/local/kong \
    && ln -s /usr/local/openresty/luajit/bin/luajit /usr/local/bin/luajit \
    && ln -s /usr/local/openresty/luajit/bin/luajit /usr/local/bin/lua \
    && ln -s /usr/local/openresty/nginx/sbin/nginx /usr/local/bin/nginx \
    && kong version
   
COPY docker-entrypoint.sh /docker-entrypoint.sh
 
COPY start_services.sh /start_services.sh

RUN chmod +x start_services.sh

RUN ./start_services.sh
  
USER kong
   
ENTRYPOINT ["/docker-entrypoint.sh"]
   
EXPOSE 8000 8443 8001 8001 8444
   
STOPSIGNAL SIGQUIT
   
HEALTHCHECK --interval=10s --timeout=10s --retries=10 CMD kong health
   
CMD ["kong", "docker-start"]



