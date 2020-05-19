# The default target must be at the top
.DEFAULT_GOAL := build

install:
	npm install

update-deps:
	ncu -u
	npm i line-clamp@1.2.10 --save-exact

build:
	./node_modules/.bin/rollup -c -w

lint:
	./node_modules/.bin/xo

run-server:
	node server/index.js

test: lint

