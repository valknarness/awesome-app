'use client'

import * as React from 'react'
import { Plus, Check } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { AwesomeIcon } from '@/components/ui/awesome-icon'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { usePersonalListStore, type PersonalListItem } from '@/lib/personal-list-store'
import { cn } from '@/lib/utils'

interface PushToListButtonProps {
  title: string
  description: string
  url: string
  repository?: string
  variant?: 'default' | 'ghost' | 'outline'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  showLabel?: boolean
  onPush?: () => void
}

const DEFAULT_CATEGORIES = [
  'Development',
  'Design',
  'Tools',
  'Resources',
  'Libraries',
  'Frameworks',
  'Documentation',
  'Learning',
  'Inspiration',
  'Other',
]

export function PushToListButton({
  title: initialTitle,
  description: initialDescription,
  url,
  repository,
  variant = 'outline',
  size = 'default',
  className,
  showLabel = true,
  onPush,
}: PushToListButtonProps) {
  const { addItem, openEditor, items } = usePersonalListStore()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const [isAdded, setIsAdded] = React.useState(false)

  const [formData, setFormData] = React.useState({
    title: initialTitle,
    description: initialDescription,
    url,
    repository: repository || '',
    category: 'Development',
    tags: '',
  })

  // Check if item is already added
  React.useEffect(() => {
    const alreadyAdded = items.some((item) => item.url === url)
    setIsAdded(alreadyAdded)
  }, [items, url])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const tags = formData.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    addItem({
      title: formData.title,
      description: formData.description,
      url: formData.url,
      repository: formData.repository || undefined,
      category: formData.category,
      tags: tags.length > 0 ? tags : undefined,
    })

    setIsDialogOpen(false)
    setIsAdded(true)

    toast.success(
      <div className="flex items-center gap-2">
        <AwesomeIcon size={16} />
        <span>Added to your awesome list!</span>
      </div>,
      {
        action: {
          label: 'View List',
          onClick: () => openEditor(),
        },
      }
    )

    onPush?.()
  }

  return (
    <>
      <Button
        variant={isAdded ? 'default' : variant}
        size={size}
        className={cn(
          'group transition-all',
          isAdded && 'btn-awesome cursor-default',
          className
        )}
        onClick={() => !isAdded && setIsDialogOpen(true)}
        disabled={isAdded}
      >
        {isAdded ? (
          <>
            <Check className="h-4 w-4" />
            {showLabel && <span className="ml-2">Added</span>}
          </>
        ) : (
          <>
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90" />
            {showLabel && <span className="ml-2">Push to my list</span>}
          </>
        )}
      </Button>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AwesomeIcon size={20} />
                <span className="gradient-text">Add to My Awesome List</span>
              </DialogTitle>
              <DialogDescription>
                Customize the details before adding this item to your personal list.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Enter title"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                  placeholder="Enter description"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="url">URL *</Label>
                <Input
                  id="url"
                  type="url"
                  value={formData.url}
                  onChange={(e) =>
                    setFormData({ ...formData, url: e.target.value })
                  }
                  required
                  placeholder="https://..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="repository">Repository (optional)</Label>
                <Input
                  id="repository"
                  value={formData.repository}
                  onChange={(e) =>
                    setFormData({ ...formData, repository: e.target.value })
                  }
                  placeholder="owner/repo"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category || 'Development'}
                  onValueChange={(value) =>
                    setFormData({ ...formData, category: value || 'Development' })
                  }
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {DEFAULT_CATEGORIES.filter(cat => cat && cat.trim()).map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tags">Tags (optional)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                  placeholder="react, typescript, ui (comma separated)"
                />
                <p className="text-muted-foreground text-xs">
                  Separate tags with commas
                </p>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" className="btn-awesome">
                <Plus className="mr-2 h-4 w-4" />
                Add to List
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
