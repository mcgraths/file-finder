# file-finder

A rough script that searches the current working directory for files that match a list of strings passed as command line parameters. Matching files can then be copied to a subfolder.

```
Usage: file-finder [options]

  Options:

    -V, --version            output the version number
    -s, --strings <items>    Match filenames in the current directory from a list of comma separated strings
    -d, --dir <dir>          Match filenames in the current directory from the contents of another directory
    -D, --destination <dir>  Destination folder
    -h, --help               output usage information

```