import { ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'
import customParseFormat from 'dayjs/plugin/customParseFormat'

// Extend dayjs with plugins
dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.extend(customParseFormat)

// Set default timezone
dayjs.tz.setDefault('Asia/Jakarta')

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  return dayjs(date)
    .tz('Asia/Jakarta')
    .format('YYYY-MM-DD HH:mm')
}

export function formatDateToDayjs(date: Date | string) {
  return dayjs(date)
    .tz('Asia/Jakarta')
}

export function generateWorkOrderNumber() {
  const date = dayjs().tz('Asia/Jakarta')
  const year = date.year()
  const month = date.format('MM')
  const day = date.format('DD')
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')

  return `WO-${year}${month}${day}-${random}`
}

export function formatDuration(start: Date, end: Date) {
  const diff = end.getTime() - start.getTime()
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }
  return `${minutes}m`
}