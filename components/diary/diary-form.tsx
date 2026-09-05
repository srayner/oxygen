'use client'

import { useState, useEffect, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getToday } from '@/lib/diary-utils'

interface DiaryFormProps {
  onSaved: () => void
}

export function DiaryForm({ onSaved }: DiaryFormProps) {
  const [date, setDate] = useState(getToday())
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoadingEntry, setIsLoadingEntry] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!date) return

    let ignore = false
    setIsLoadingEntry(true)

    fetch(`/api/diary?date=${date}`)
      .then((res) => (res.ok ? res.json() : null))
      .then((entry) => {
        if (!ignore) setContent(entry?.content ?? '')
      })
      .finally(() => {
        if (!ignore) setIsLoadingEntry(false)
      })

    return () => {
      ignore = true
    }
  }, [date])

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    if (!date) {
      setError('Date is required')
      return
    }

    if (!content.trim()) {
      setError('Write something before saving')
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch('/api/diary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, content }),
      })
      if (res.ok) {
        onSaved()
      } else {
        setError('Failed to save entry')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Diary Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full max-w-xs"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content">Your thoughts</Label>
            <Textarea
              id="content"
              name="content"
              autoFocus
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What were you thinking about? What did you do today?"
              disabled={isLoadingEntry}
              className="min-h-[180px] resize-y"
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting || isLoadingEntry || !content.trim()}
            className="w-full"
          >
            {isSubmitting ? 'Saving...' : 'Save'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
