// Import required modules
import fs from "fs";
import path from "path";

// Type definitions for dependencies
interface Dependencies {
  [key: string]: string;
}

// Function to merge dependencies
function mergeDependencies(
  dep1: Dependencies = {},
  dep2: Dependencies = {}
): Dependencies {
  const merged: Dependencies = { ...dep1 };

  for (const [pkg, version] of Object.entries(dep2)) {
    if (!merged[pkg] || merged[pkg] < version) {
      merged[pkg] = version;
    }
  }

  return merged;
}

// Function to merge two package.json files
function mergePackageJson(
  file1: string,
  file2: string,
  outputFile: string
): void {
  try {
    // Read and parse the first package.json
    const package1 = JSON.parse(fs.readFileSync(file1, "utf8"));

    // Read and parse the second package.json
    const package2 = JSON.parse(fs.readFileSync(file2, "utf8"));

    // Merge dependencies and devDependencies
    const mergedDependencies = mergeDependencies(
      package1.dependencies,
      package2.dependencies
    );
    const mergedDevDependencies = mergeDependencies(
      package1.devDependencies,
      package2.devDependencies
    );

    // Create the merged package.json object
    const mergedPackage = {
      ...package1,
      ...package2,
      dependencies: mergedDependencies,
      devDependencies: mergedDevDependencies,
    };

    // Write the merged package.json to the output file
    fs.writeFileSync(
      outputFile,
      JSON.stringify(mergedPackage, null, 2),
      "utf8"
    );

    console.log(`Merged package.json written to ${outputFile}`);
  } catch (error) {
    console.error("Error merging package.json files:", error);
  }
}

// Get input paths from command-line arguments
const [file1, file2, outputFile] = process.argv.slice(2);

if (!file1 || !file2 || !outputFile) {
  console.error(
    "Usage: ts-node mergePackages.ts <path to package1.json> <path to package2.json> <output path>"
  );
  process.exit(1);
}

mergePackageJson(
  path.resolve(file1),
  path.resolve(file2),
  path.resolve(outputFile)
);
