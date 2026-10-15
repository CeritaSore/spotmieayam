import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distDir = path.resolve(__dirname, '../dist')
const subDir = path.resolve(distDir, 'spotmieayam')

if (fs.existsSync(distDir)) {
  if (!fs.existsSync(subDir)) {
    fs.mkdirSync(subDir, { recursive: true })
  }

  // Duplicate assets into dist/spotmieayam/assets
  const assetsSrc = path.resolve(distDir, 'assets')
  const assetsDest = path.resolve(subDir, 'assets')
  if (fs.existsSync(assetsSrc)) {
    fs.cpSync(assetsSrc, assetsDest, { recursive: true })
  }

  // Duplicate index.html into dist/spotmieayam/index.html
  const indexSrc = path.resolve(distDir, 'index.html')
  const indexDest = path.resolve(subDir, 'index.html')
  if (fs.existsSync(indexSrc)) {
    fs.copyFileSync(indexSrc, indexDest)
  }

  // Duplicate favicon.ico into dist/spotmieayam/favicon.ico
  const faviconSrc = path.resolve(distDir, 'favicon.ico')
  const faviconDest = path.resolve(subDir, 'favicon.ico')
  if (fs.existsSync(faviconSrc)) {
    fs.copyFileSync(faviconSrc, faviconDest)
  }

  console.log('✓ Postbuild completed: Mirrored files to dist/spotmieayam for reverse-proxy compatibility.')
}
