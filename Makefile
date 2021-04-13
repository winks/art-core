HOST=deploy_web
PATH_I=/srv/docker/web/data/www/i.f5n.de/public
PATH_Q=/srv/docker/web/data/www/q.f5n.de/public

help:
	@echo "deploy stuff:"
	@echo "   make i"
	@echo "   make q"

copy:
	$(eval TMPDIR := $(shell echo "tmp_${SRC}"))
	echo ${HOST} ${DEST} ${SRC} $(TMPDIR)
	/usr/bin/ssh ${HOST} "mkdir -p tmp/$(TMPDIR)"
	/usr/bin/rsync -avz ${SRC}/ ${HOST}:tmp/$(TMPDIR)
	/usr/bin/ssh ${HOST} 'sudo chown -R www-data: tmp/$(TMPDIR)'
	/usr/bin/ssh ${HOST} 'sudo rsync -avz tmp/$(TMPDIR)/ ${DEST}/'
	/usr/bin/ssh ${HOST} 'sudo rm -rf tmp/$(TMPDIR)'

i:
	DEST=${PATH_I} SRC=i make copy

q:
	DEST=${PATH_Q} SRC=q make copy


.PHONY: i q help copy
