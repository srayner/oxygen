'use client'

import { useState, useEffect, useRef } from 'react'
import { Trash2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatEntryDate } from '@/lib/diary-utils'
import type { DiaryEntry } from './diary-tracker'

interface DiaryListProps {
  entries: DiaryEntry[]
  hasMore: boolean
  isLoadingMore: boolean
  onLoadMore: () => void
  onDelete: (id: string) => void
}

export function DiaryList({
  entries,
  hasMore,
  isLoadingMore,
  onLoadMore,
  onDelete,
}: DiaryListProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el || !hasMore) return

    const io = new IntersectionObserver(
      (observed) => {
        if (observed[0].isIntersecting) onLoadMore()
      },
      { rootMargin: '200px' }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [hasMore, onLoadMore])

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    try {
      const res = await fetch(`/api/diary/${id}`, { method: 'DELETE' })
      if (res.ok) {
        onDelete(id)
      }
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Past Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="py-4 text-center text-muted-foreground">
            No entries yet.
          </p>
        ) : (
          <div className="space-y-3">
            {entries.map((entry) => (
              <div key={entry.id} className="rounded-lg border bg-card p-4">
                <div className="flex items-start justify-between gap-2">
                  <span className="text-sm font-medium text-muted-foreground">
                    {formatEntryDate(entry.date)}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(entry.id)}
                    disabled={deletingId === entry.id}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
                <p className="mt-2 whitespace-pre-wrap text-sm">
                  {entry.content}
                </p>
              </div>
            ))}

            {hasMore && <div ref={sentinelRef} />}

            {hasMore && (
              <Button
                variant="ghost"
                onClick={onLoadMore}
                disabled={isLoadingMore}
                className="w-full"
              >
                {isLoadingMore ? 'Loading...' : 'Load more'}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
