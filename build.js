const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// TypeScript files to compile
const tsFiles = [
  'app.ts',
  'components/header/header.ts',
  'components/sidebar/sidebar.ts',
  'dashboard/dashboard.ts',
  'inventory/inventory.ts',
  'orders/orders.ts',
  'production/production.ts',
  'reports/reports.ts',
  'user-access/user-access.ts',
  'support/support.ts'
];

// Compile TypeScript files to JavaScript
console.log('Compiling TypeScript files...');

try {
  // Compile all TypeScript files
  execSync('tsc', { stdio: 'inherit' });
  
  // Copy compiled JS files to their original locations
  tsFiles.forEach(tsFile => {
    const jsFile = tsFile.replace('.ts', '.js');
    const compiledFile = path.join('dist', jsFile);
    const targetFile = jsFile;
    
    if (fs.existsSync(compiledFile)) {
      fs.copyFileSync(compiledFile, targetFile);
      console.log(`Copied ${compiledFile} to ${targetFile}`);
    }
  });
  
  console.log('TypeScript compilation completed successfully!');
} catch (error) {
  console.error('Error compiling TypeScript:', error.message);
  process.exit(1);
}
