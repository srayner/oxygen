'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { DiaryForm } from './diary-form'
import { DiaryList } from './diary-list'

export interface DiaryEntry {
  id: string
  date: string
  content: string
  updatedAt: string
}

const PAGE_SIZE = 10

export function DiaryTracker() {
  const [entries, setEntries] = useState<DiaryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [offset, setOffset] = useState(0)
  const [hasMore, setHasMore] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const loadingRef = useRef(false)

  const fetchInitial = useCallback(async () => {
    const res = await fetch(`/api/diary?limit=${PAGE_SIZE}&offset=0`)
    if (res.ok) {
      const data = await res.json()
      setEntries(data.entries)
      setHasMore(data.hasMore)
      setOffset(data.entries.length)
    }
  }, [])

  useEffect(() => {
    fetchInitial().finally(() => {
      setIsLoading(false)
    })
  }, [fetchInitial])

  const loadMore = useCallback(async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    setIsLoadingMore(true)
    try {
      const res = await fetch(`/api/diary?limit=${PAGE_SIZE}&offset=${offset}`)
      if (res.ok) {
        const data = await res.json()
        setEntries((prev) => [...prev, ...data.entries])
        setHasMore(data.hasMore)
        setOffset((prev) => prev + data.entries.length)
      }
    } finally {
      loadingRef.current = false
      setIsLoadingMore(false)
    }
  }, [offset])

  const handleDelete = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id))
    setOffset((prev) => Math.max(prev - 1, 0))
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-72 animate-pulse rounded-lg border bg-card" />
        <div className="h-48 animate-pulse rounded-lg border bg-card" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <DiaryForm onSaved={fetchInitial} />
      <DiaryList
        entries={entries}
        hasMore={hasMore}
        isLoadingMore={isLoadingMore}
        onLoadMore={loadMore}
        onDelete={handleDelete}
      />
    </div>
  )
}
