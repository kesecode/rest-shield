#!/bin/bash

# Password prompt
read -s -p "Please enter the password: " password
echo "ok"

# Files to be encrypted
files=("firebase_config.json" "firestore_key.json" "secret_key.json" "test_credentials.json")

# Loop to process each file
for file in "${files[@]}"
do
    # Archive name
    archive_name="${file}.tar"

    # Include file in the archive
    tar -cf "$archive_name" "$file"

    # Encrypt the archive
    echo "$password" | gpg --batch --yes --symmetric --cipher-algo AES256 --passphrase-fd 0 --output "${file}.tar.gpg" "$archive_name"

    # Delete the archive
    rm "$archive_name"

    # Print success message
    echo "The file $file has been encrypted successfully."
done