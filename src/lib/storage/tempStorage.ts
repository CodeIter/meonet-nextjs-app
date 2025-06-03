
import fs from 'fs/promises'
import path from 'path'
import { StorageService, PasteEntry } from './types'

const DATA_DIR = path.join(process.cwd(), 'tmp', 'storage')

export class TempFsStorage implements StorageService {
  constructor() {
    this.init()
  }

  private async init() {
    try {
      await fs.access(DATA_DIR)
    } catch {
      await fs.mkdir(DATA_DIR, { recursive: true })
    }
  }

  async getPaste(id: string) {
    try {
      const data = await fs.readFile(path.join(DATA_DIR, `paste_${id}.json`), 'utf-8')
      return JSON.parse(data)
    } catch {
      return null
    }
  }

  async savePaste(paste: PasteEntry) {
    await fs.writeFile(
      path.join(DATA_DIR, `paste_${paste.id}.json`),
      JSON.stringify(paste, null, 2)
    )
  }

  async getRecentPastes() {
    const files = await fs.readdir(DATA_DIR)
    const pastes = []
    for (const file of files.filter(f => f.startsWith('paste_'))) {
      const data = await fs.readFile(path.join(DATA_DIR, file), 'utf-8')
      pastes.push(JSON.parse(data))
    }
    return pastes.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    ).slice(0, 10)
  }

  async getUrl(shortCode: string): Promise<{ url: string } | null> {
      const filePath = path.join(DATA_DIR, `url_${shortCode}.json`)
      try {
        const data = await fs.readFile(filePath, 'utf-8')
        const entry = JSON.parse(data)
        return { url: entry.url }
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        return null
      }
  }

  async saveUrl({ shortCode, url, ip }: { shortCode: string; url: string; ip: string }): Promise<void> {
    const filePath = path.join(DATA_DIR, `url_${shortCode}.json`)
    await fs.writeFile(
      filePath,
      JSON.stringify({ shortCode, url, ip }, null, 2)
    )
  }

}