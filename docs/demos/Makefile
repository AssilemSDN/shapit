
IMAGE := shapit-vhs
ROOT := ../..

.PHONY: build init audit all

build:
	docker build -f Dockerfile.vhs -t $(IMAGE) $(ROOT)

init:
	docker run --rm \
		-v "$(abspath $(ROOT)/docs/images):/app/docs/images" \
		$(IMAGE) docs/demos/init.tape

audit:
	docker run --rm \
		-w /app \
		-v "$(abspath $(ROOT)/docs/images):/app/docs/images" \
		$(IMAGE) /app/docs/demos/audit.tape

all: build init audit

