#!/usr/bin/env bash

# getfiles.sh
# This script lists and concatenates the contents of selected files
# in the current directory and its subdirectories, excluding certain
# directories.
# Useful for feeding the contents of files to a language model for analysis
# or summarization.

echo "Files: ${@}"
echo

{
tree -a -I .git --gitignore
echo
for f in "${@}" ; do
  if [[ -f "$f" ]] ; then
    echo "================================================================================"
    echo "File: $f"
    echo "================================================================================"
    cat -n "$f"
    echo
    echo "================================================================================"
  fi
done
} | tee getfiles.txt | (bat || less)
