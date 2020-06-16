FROM envoyproxy/envoy-dev:01cc47a337d6bb2e46500f7e653057d04382e6b1
COPY ./envoy.yaml /etc/envoy/envoy.yaml
CMD /usr/local/bin/envoy -c /etc/envoy/envoy.yaml
