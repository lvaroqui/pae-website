#!/bin/bash
cd back
rsync -e ssh -avz --delete-after --exclude={'node_modules/*','seeders/*','.gitignore','.eslintrc.js'} \
 . pae@pae.varoqui.org:back
ssh -t pae@pae.varoqui.org "cd back && pnpm install && sudo systemctl restart pae-back.service"
cd ..