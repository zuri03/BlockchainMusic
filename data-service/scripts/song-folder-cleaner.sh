#!/bin/sh
ITEMS=$(find /opt/app/songs -type d -mindepth 1 -maxdepth 1)
for item in $ITEMS; do
    #count the number of files in the user directory 
    FILECOUNT=$(find $item -type f -maxdepth 1 -print | wc -l)
    #if file count is zero then remove the folder
    if [ $FILECOUNT -eq 0 ]
    then
        rmdir $item
    fi
done


