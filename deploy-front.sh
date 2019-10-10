#!/bin/bash
cd front
pnpm run build
rsync -e ssh -avz --delete-after dist/ pae@pae.varoqui.org:pae.varoqui.org
cd ..