

class FileItem {
    constructor(name) {
        if (new.target === FileItem) {
            throw new TypeError("Cannot construct FileItem instances directly");
        }
        this.name = name;
    }

    getSize() {
        throw new Error("Method 'getSize()' must be implemented.");
    }

    display(indent = 0) {
        throw new Error("Method 'display()' must be implemented.");
    }
}

class File extends FileItem {
    constructor(name, content = "") {
        super(name);

        this.content = content;
    }

    getSize() {
        return this.content.length;
    }

    display(indent = 0) {
        console.log(" ".repeat(indent) + this.name);
    }
}


class Directory extends FileItem {
    constructor(name) {
        super(name);
        this.items = [];
    }

    addItem(item) {
        this.items.push(item);
    }

    getSize() {
        return this.items.reduce((total, item) => total + item.getSize(), 0);
    }

    display(indent = 0) {
        console.log(" ".repeat(indent) + this.name + '/');
        this.items.forEach(item => item.display(indent + 4));
    }
}

class FileSystem {
    constructor() {
        this.root = new Directory("root");
    }

    getRoot() {
        return this.root;
    }

    display() {
        this.root.display();
    }

    addFile(path, file) {
        const directory = this._traverseToDirectory(path);
        if (directory) {
            directory.addItem(file);
        } else {
            console.log(`Directory at path '${path}' not found.`);
        }
    }

    deleteFile(path) {
        let fileName = path.split('/').filter(Boolean).slice(-1)[0]; // Get the file name correctly

        const parts = path.split('/');

        parts.pop();

        const directoryPath = parts.join('/');

        const directory = this._traverseToDirectory(directoryPath);

        if (directory) {
            directory.items = directory.items.filter(item => item.name !== fileName); // Filter out the file to delete
        } else {
            console.log(`Directory not found for path: ${path}`);
        }
    }

    deleteDirectory(directoryName) {
        if (this.root.name == directoryName) return this.root = null;

        let directories = [this.root];

        while (directories.length > 0) {
            let currentDirectories = [];
            directories.forEach(directory => {
                let remainingItems = directory.items.filter(item => {
                    if (item instanceof Directory) {
                        if (item.name === directoryName) {
                            return false; // Filter out the directory to delete
                        }
                        return true; // Keep other directories
                    }
                    return true; // Keep non-directory items
                });

                directory.items = remainingItems; // Update the directory's items

                // Collect child directories for further traversal
                currentDirectories.push(...remainingItems.filter(item => item instanceof Directory));
            });

            directories = currentDirectories;
        }
    }


    addDirectory(path, directory) {
        const parentDirectory = this._traverseToDirectory(path);
        if (parentDirectory) {
            parentDirectory.addItem(directory);
        } else {
            console.log(`Directory at path '${path}' not found.`);
        }
    }



    _traverseToDirectory(path) {
        const components = path.split("/").filter(Boolean);

        let currentDirectory = this.root;

        for (const component of components) {

            const found = currentDirectory.items.find(
                (item) => item instanceof Directory && item.name === component
            );
            if (found) {
                currentDirectory = found;
            } else {
                return null;
            }

        }

        return currentDirectory;
    }
}

// Initialize the file system
const fs = new FileSystem();

// Create some files and directories
const file1 = new File("file1.txt", "Hello, World!");
const file2 = new File("file2.txt", "This is a test file.");
const subDir = new Directory("subdir");
const subFile = new File("subfile.txt", "Content in subfile.");

// Add items to the file system
fs.addFile("/", file1);
fs.addDirectory("/", subDir);
fs.addFile("/subdir", subFile);
fs.addFile("/", file2);

// Display the file system structure
fs.display();

fs.deleteFile('/subdir/subfile.txt')

fs.display();

fs.deleteDirectory('subdir')
fs.display();

let subDir2 = new Directory("subDir2");
let subFile2 = new File("subFile2", "Namaste India");

fs.addDirectory('/', subDir2)
fs.addFile('/subDir2', subFile2)
fs.display()