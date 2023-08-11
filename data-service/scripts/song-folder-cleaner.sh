FILECOUNT=$(find /opt/app/songs -type f -maxdepth 1 -print | wc -c)
echo "FILECOUNT: " $FILECOUNT
#for item in /opt/app/songs do
#    #count the number of files in the user directory 
#    FILECOUNT="$(find $item -type f -maxdepth 1 -printf x | wc -c)"
#
#    #if file count is zero then remove the folder
#    if [$FILECOUNT -eq 0] then
#        $(rm /opt/app/songs/$item)
#    fi
#done


